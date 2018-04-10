
exports.init = app => app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {

    let preferredType = ctx.accepts('html', 'json');

    if (e.status) {
      // could use template methods to render error page
      ctx.body = e.message;
      ctx.status = e.status;
    } else if (e.name == "ValidationError") {

      ctx.status = 400;

      let errors = {};

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
      ctx.body = 'Error 500';
      ctx.status = 500;
      console.error(e.message, e.stack);
    }

  }
});
