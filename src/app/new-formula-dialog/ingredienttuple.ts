  export class ingredienttuple {
    create(event: { ingredient: string; quantity: number }) {
      return { ingredient: event.ingredient, quantity: event.quantity };
    }
  }
