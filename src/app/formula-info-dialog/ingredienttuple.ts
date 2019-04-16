  export class ingredienttuple {
    ingredient: any;
    quantity: Number;
    create(event: { ingredient: string; quantity: number }) {
      return { ingredient: event.ingredient, quantity: event.quantity };
    }
  }
