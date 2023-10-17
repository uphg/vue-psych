const timeline = [
  {
    type: 'colorSelect',
    data: {
      message: '该文字是什么颜色',
      text: 'Green',
      correctResponse: 'red',
      options: ['red', 'blue', 'green']
    },
    onStart() {},
    onFinish() {}
  },
  {
    type: 'colorSelect',
    data: {
      message: '该文字是什么颜色',
      text: 'Red',
      correctResponse: 'blue',
      options: ['red', 'blue', 'green']
    },
    onStart() {},
    onFinish() {}
  },
  {
    type: 'colorSelect',
    data: {
      message: '该文字是什么颜色',
      text: 'Blue',
      correctResponse: 'green',
      options: ['red', 'blue', 'green']
    },
    onStart() {},
    onFinish() {}
  },
  {
    timeline: [
      {
        type: 'loading',
        trialDuration: 1000
      },
      {
        type: 'singleSelect',
        data: {
          options: ['选项1', '选项2', '选项3', '选项4', '选项5']
        }
      }
    ],
    timelineVariables: [
      { message: '我的生活在大多数情况下接近我的理想状态' },
      { message: '我的生活条件非常好' },
      { message: '我对我的生活感到满意' },
      { message: '目前为止我已经得到了生活中我想得到的重要东西' },
      { message: '如果生活可以重来，我还愿意过现在这样的生活' },
    ]
  }
]

const rawTimeline = [
  {
    type: 'colorSelect',
    data: {
      message: '该文字是什么颜色',
      text: 'Green',
      correctResponse: 'red',
      options: ['red', 'blue', 'green']
    },
    onStart() {},
    onFinish() {}
  },
  {
    type: 'colorSelect',
    data: {
      message: '该文字是什么颜色',
      text: 'Red',
      correctResponse: 'blue',
      options: ['red', 'blue', 'green']
    },
    onStart() {},
    onFinish() {}
  },
  {
    type: 'colorSelect',
    data: {
      message: '该文字是什么颜色',
      text: 'Blue',
      correctResponse: 'green',
      options: ['red', 'blue', 'green']
    },
    timelineNode: {

    },
    onStart() {},
    onFinish() {}
  },
  {
    timeline: [
      {
        type: 'loading',
        trialDuration: 1000
      },
      {
        type: 'singleSelect',
        data: {
          options: ['选项1', '选项2', '选项3', '选项4', '选项5'],
          s: timelineVariables('message')
        }
      }
    ],
    timelineNodes: [],
    timelineVariables: [
      { message: '我的生活在大多数情况下接近我的理想状态' },
      { message: '我的生活条件非常好' },
      { message: '我对我的生活感到满意' },
      { message: '目前为止我已经得到了生活中我想得到的重要东西' },
      { message: '如果生活可以重来，我还愿意过现在这样的生活' },
    ]
  }
]

const outputData = [
  {
    type: 'loading',
    trialDuration: 1000
  },
  {
    type: 'singleSelect',
    data: {
      message: '我的生活在大多数情况下接近我的理想状态',
      options: ['选项1', '选项2', '选项3', '选项4', '选项5']
    }
  },
  {
    type: 'loading',
    trialDuration: 1000
  },
  {
    type: 'singleSelect',
    data: {
      message: '我的生活条件非常好',
      options: ['选项1', '选项2', '选项3', '选项4', '选项5']
    }
  },
  {
    type: 'loading',
    trialDuration: 1000
  },
  {
    type: 'singleSelect',
    data: {
      message: '我对我的生活感到满意',
      options: ['选项1', '选项2', '选项3', '选项4', '选项5']
    }
  }
]