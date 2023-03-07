class Dialog {
  key: string
  component: any
  props: any
  events: any
  meta: any
  show: boolean
  render: boolean
  confirmBtnLoading: boolean
  cancelBtnLoading: boolean
  
  constructor(component: any, props: any, events: any, meta: any) {
    let random:any = Math.random() * Math.random() * 1000000
    this.key = `key_${(new Date()).getTime()}_${parseInt(random)}`
    this.component = component
    this.props = props
    this.events = events
    this.meta = meta
    this.show = false
    this.render = true
    this.confirmBtnLoading = false
    this.cancelBtnLoading = false
  }
}

export { Dialog }
