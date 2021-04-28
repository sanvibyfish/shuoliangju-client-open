/** @format */

import Taro, {Component, Config} from '@tarojs/taro'
import {View, Text, Button} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import './choose-sections.scss'
import {BaseProps, BaseStates} from '../../utils/base.interface'
import {J2Radio} from '../../components'
import Tips from '../../utils/tips'
import {section} from '../../models/schema'
import {normalize, denormalize} from 'normalizr'
import {Router} from '../../config/router'
import EntityUtils from '../../utils/entity_utils'

/**
 * choose-sections.state 参数类型
 *
 * @export
 * @interface Choose-sectionsState
 */
export interface ChooseSectionsState extends BaseStates{
  sectionId: number | null
}

/**
 * choose-sections.props 参数类型
 *
 * @export
 * @interface Choose-sectionsProps
 */
export interface ChooseSectionsProps extends BaseProps {
  sectionIds: Array<any>
  entities: any
}

@connect(({chooseSections, entities, loading}) => ({
  ...chooseSections,
  entities: entities,
  loading: loading.models.chooseSections,
}))
class ChooseSections extends Component<ChooseSectionsProps, ChooseSectionsState> {
  config: Config = {
    navigationBarTitleText: '选择板块',
  }
  constructor(props: ChooseSectionsProps) {
    super(props)
    this.state = {
      sectionId: null,
      appId: null
    }
  }

  onSectionClick(detail) {
    this.setState({
      sectionId: this.props.sectionIds[detail.index],
    })
  }

  async getSections() {
    await this.props.dispatch({
      type: 'chooseSections/getSections',
      payload: {
        app_id: this.state.appId
      }
    })
  }

  onFinish() {
    Router.back(
      {},
      {
        sectionId: this.state.sectionId,
      },
    )
  }
  componentWillMount() {
    let params = Router.getParams(this.$router.params)
    this.setState({
      sectionId: params.sectionId,
      appId: params.appId
    })
  }

  componentDidMount() {
    this.getSections()
  }

  render() {
    const {sectionIds, entities, loading} = this.props
    const sections = EntityUtils.getSections(entities,sectionIds)
    return (
      <View className="container">
        <View className="sections">
          {sectionIds && (
            <J2Radio
              options={sections.map(section => ({
                label: section.name + (section.role == "admin" ? "(只有管理员可以在该板块发帖)": ""),
                value: section.id,
              }))}
              value={`${this.state.sectionId}`}
              onItemClick={this.onSectionClick.bind(this)}
            />
          )}
          <Button className="btn btn-finish" onClick={this.onFinish.bind(this)}>
            完成
          </Button>
        </View>
      </View>
    )
  }
}
export default ChooseSections
