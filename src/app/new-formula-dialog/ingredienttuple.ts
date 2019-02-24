class ingredienttuple {
  static create(event: { ingredient: string; quantity: number }) {
    return { ingredient: event.ingredient, quantity: event.quantity };
  }
}