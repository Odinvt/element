export default {
  init: (VueComponentContext) => {
    VueComponentContext.skipEvents = ['input', 'change', 'blur', 'focus'];
    VueComponentContext.userEvents = [];

    // get the events that the user wants to register on the input (only the event name, not the handler)
    // while skipping the events already handled by element-ui
    Object.keys(VueComponentContext.$options._parentListeners).forEach((e) => {
      if (VueComponentContext.skipEvents.indexOf(e) === -1) {
        let obj = {event: e, handler: null};
        VueComponentContext.userEvents.push(obj);
      }
    });
  },
  registerUserEvents: (VueComponentContext, HTMLDOM) => {
    // assumes component is mounted and the above "init" method is called on the component

    for (let i = 0; i < VueComponentContext.userEvents.length; i++) {
      // foreach event, register a handler that simply emits the event instance up the bubble chain
      // will eventually get caught by the event listener that the user registered on the element
      VueComponentContext.userEvents[i].handler = (e) => {
        VueComponentContext.$emit(VueComponentContext.userEvents[i].event, e);
      };
      HTMLDOM.addEventListener(VueComponentContext.userEvents[i].event, VueComponentContext.userEvents[i].handler);
    }
  },
  unregisterUserEvents: (VueComponentContext, HTMLDOM) => {
    // assumes component is mounted and the above method were called on the component
    // should be called on the Vue beforeDestroy method

    // do some manual cleanup
    for (let i = 0; i < VueComponentContext.userEvents.length; i++) {
      HTMLDOM.removeEventListener(VueComponentContext.userEvents[i].event, VueComponentContext.userEvents[i].handler);
    }
  }
};
