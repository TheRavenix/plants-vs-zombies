export interface Updatable<T = void> {
  update(deltaTime: number): T;
}
