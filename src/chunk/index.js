import 'core-js/modules/es.promise';
import * as a from './a.js';

console.log('I am entry module');

import('./chunk1.js').then(() => {
  console.log('chunk1 loaded');
});

import('./chunk2.js').then(() => {
  console.log('chunk2 loaded');
});

export {
  a
};