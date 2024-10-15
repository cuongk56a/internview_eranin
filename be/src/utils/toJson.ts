const deletedAtPath = (obj: { [x: string]: any; }, path: string | any[], index: number) => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  deletedAtPath(obj[path[index]], path, index + 1);
};

export const toJSON = (schema: any) => {
  let transform: (arg0: any, arg1: any, arg2: any) => any;
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform;
  }

  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc: any, ret: { id: any; _id: { toString: () => any; }; __v: any; }, options: any) {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          deletedAtPath(ret, path.split('.'), 0);
        }
      });

      ret.id = ret._id.toString();
      delete ret.__v;
      if (transform) {
        return transform(doc, ret, options);
      }
    },
  });
};