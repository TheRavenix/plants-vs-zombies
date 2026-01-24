export interface Health {
  readonly hp: number;
  heal(amount: number): void;
  takeDamage(amount: number): void;
  isDead(): boolean;
}

type Options = {
  hp: number;
};

export function createHealth(options: Options): Health {
  let hp = options.hp;

  return {
    get hp() {
      return hp;
    },
    heal(amount) {
      hp += amount;
    },
    takeDamage(amount) {
      hp = Math.max(0, hp - amount);
    },
    isDead() {
      return hp <= 0;
    },
  };
}
