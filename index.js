var ability = new (require('./lib/ability'))();
  // , helpers = require('./lib/helpers');

exports = module.exports = createAbilities;

function createAbilities(abilities) {
	ability.abilities = abilities;
  return exports;
}

exports.add = function (schema) {
	createAbilities(schema);
}

exports.configure = function(options) {
	for (var i in options) {
		ability[i] = options[i];
		// console.log(this);
	}
}

//Function to be called from body
authorize = function(action, target, role) {
	req = arguments.callee.caller.arguments[0];
	res = arguments.callee.caller.arguments[1];

	if (req.user) {
		ability.role = req.user[ability.role_name];
	}
	if (role) {
	  ability.role = role;
	}

	// extrapolating everything from the req.route
	if (target == null && action == null) {
		value = ability.can_role(req);
	} else {
		// everything is explicitly defined or the user is not using everyauth
		value = ability.can_ability(action, target);		
	}
	console.log(value);
	return value;
 	    	  
}

//Function to work as a middleware
authorizeHandler = function(req, res, next) {
	if(authorize())
		next()
	else if(ability.redirect)
		res.redirect(ability.redirect_to + "?message=" + ability.redirect_message);
	else{
		res.status(401).send(ability.redirect_message);
		next(ability.redirect_message); 
	}
}