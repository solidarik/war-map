
exports.init = app => app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    ctx.set('X-Content-Type-Options', 'nosniff');

    const preferredType = ctx.accepts('html', 'json');

    if (e.status) {
      ctx.status = e.status;

      // could use template methods to render error page
      if (preferredType == 'json') {
        ctx.body = {
          error: e.message
        };
      } else {
        ctx.body = e.message;
      }

    } else if (e.name == 'ValidationError') {

      ctx.status = 400;

      const errors = {};

      for (let field in e.errors) {
        errors[field] = e.errors[field].message;
      }

      if (preferredType == 'json') {
        ctx.body = {
          errors: errors
        };
      } else {
        ctx.body = "Некорректные данные.";
      }

    } else {
      ctx.body = "Error 500";
      ctx.status = 500;
      console.error(e.message, e.stack);
    }
  }
});
