export class UserRepository {
  #db;
  #fields = ['id', 'email', 'name', 'createdAt'];

  constructor({ db }) {
    this.#db = db;
  }

  findAll() {
    return this.#db.orm.public.User.select(...this.#fields).all();
  }

  // id를 숫자로 바꿔 넘깁니다. id가 undefined면 NaN 오류가 나서 조건 없이 첫 행을 조회·수정·삭제하는 일을 막습니다.
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
