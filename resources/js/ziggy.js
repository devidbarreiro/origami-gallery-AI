const Ziggy = {"url":"http:\/\/localhost","port":null,"defaults":{},"routes":{"origami.index":{"uri":"\/","methods":["GET","HEAD"]},"origami.create":{"uri":"origami\/create","methods":["GET","HEAD"]},"origami.store":{"uri":"origami","methods":["POST"]},"origami.show":{"uri":"origami\/{origami}","methods":["GET","HEAD"],"parameters":["origami"],"bindings":{"origami":"id"}},"origami.destroy":{"uri":"origami\/{origami}","methods":["DELETE"],"parameters":["origami"],"bindings":{"origami":"id"}},"storage.local":{"uri":"storage\/{path}","methods":["GET","HEAD"],"wheres":{"path":".*"},"parameters":["path"]}}};
if (typeof window !== 'undefined' && typeof window.Ziggy !== 'undefined') {
  Object.assign(Ziggy.routes, window.Ziggy.routes);
}
export { Ziggy };
