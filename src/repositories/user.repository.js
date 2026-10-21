export class UserRepository {
  #db;
  #fields = ['id', 'email', 'name', 'createdAt'];

  constructor({ db }) {
    this.#db = db;
  }

  findAll() {
    return this.#db.orm.public.User.select(...this.#fields).all();
  }

  findById(id) {
    return this.#db.orm.public.User.where({ id: Number(id) })
      .select(...this.#fields)
      .first();
  }

  findByEmail(email, { includePassword = false } = {}) {
    const fields = includePassword
      ? [...this.#fields, 'password']
      : this.#fields;

    return this.#db.orm.public.User.where({ email })
      .select(...fields)
      .first();
  }

  create(data) {
    return this.#db.orm.public.User.select(...this.#fields).create(data);
  }

  update(id, data) {
    return this.#db.orm.public.User.where({ id: Number(id) })
      .select(...this.#fields)
      .update(data);
  }

  delete(id) {
    return this.#db.orm.public.User.where({ id: Number(id) }).delete();
  }
}
