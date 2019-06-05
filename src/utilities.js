// utilities function
// partition reducers
export const partition = condition => ([truly = [], falsy = []], e) => (condition(e)
  ? [[...truly, e], falsy]
  : [truly, [...falsy, e]]);

export default {
  partition,
};
