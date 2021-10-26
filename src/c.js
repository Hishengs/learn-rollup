import { name as _name } from './d';

export const name = 'c';

export const showNameInD = () => {
  console.log(_name);
};

console.log('I am c.js', showNameInD());