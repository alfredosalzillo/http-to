import { Hook, hook } from 'haunted';
/**
 * @return HTMLElement
 * */
export default hook(class UseHost extends Hook {
  update() {
    return this.state.host;
  }
});
