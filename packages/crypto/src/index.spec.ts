import {returnsTwo} from './index';

describe('Index', () => {
  it('should return 2', () => {
    const res = returnsTwo()
    expect(res).toEqual(2)
  })
  it('should error',() => {
    expect(() => {throw new Error()}).toThrowError()
  })
})
