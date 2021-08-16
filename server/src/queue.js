// https://code.iamkate.com/javascript/queues/
export class Queue {
  constructor() {
    this.a = [];
    this.b = 0;
  }

  toArray() {
    return this.a.slice(this.b, this.a.length);
  }

  isEmpty() {
    return 0 == this.a.length;
  }

  enqueue(v) {
    this.a.push(v);
  }

  dequeue() {
    if (0 != this.a.length) {
      const c = this.a[this.b];
      this.b++;
      if (2 * this.b >= this.a.length) {
        this.a = this.a.slice(this.b);
        this.b = 0;
      }
      return c;
    }
  }

  getLength() {
    return this.a.length - this.b;
  }

  peek() {
    return 0 < this.a.length ? this.a[this.b] : undefined;
  }

  peekBottom() {
    return 0 < this.a.length ? this.a[this.a.length - 1] : undefined;
  }
}
