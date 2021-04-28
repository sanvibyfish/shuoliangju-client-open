/** @format */

import {BaseProps} from '../../utils/base.interface'

/**
 * me.state 参数类型
 *
 * @export
 * @interface MeState
 */
export interface MeState {}

/**
 * me.props 参数类型
 *
 * @export
 * @interface MeProps
 */
export interface MeProps extends BaseProps {
  user: any
  hasLogin: boolean
}
