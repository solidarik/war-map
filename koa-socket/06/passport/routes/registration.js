const passport = require('koa-passport');
const User = require('../models/user');
const pick = require('lodash/pick');

exports.get = async function(ctx, next) {
	ctx.body = ctx.render('registration');
};

exports.post = async function(ctx, next) {
	const user = await User.create(pick(ctx.request.body, User.publicFields));
	// ctx.flash('error', 'message');
	// ctx.redirect('/registration');
	await ctx.login(user);
	ctx.redirect('/');
};
