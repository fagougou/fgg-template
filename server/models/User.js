/**
 * 针对接单阶段前的用户系统
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    username: String, // 用户名
    idNo: String, // 身份证
    phone: String, // 用户手机号码
    from: String, // 渠道
    consultDate: Date, // 咨询日期
    wechat: String, // 微信号
    convertDate: Date, // 转化日期
    isConvert: Boolean,
    isTarget: {type: Boolean, default: false}, // 是否为目标案源
    isTargetModify: {type: Boolean, default: false},
    signAmount: String, // 标的额
    signAmountModify: String,
    serviceStaff: String, // 咨询的客服人员
    serverMode: String, // 服务模式
    serverModeModify: String,
    signedMan: String, // 签单人
    region: String, // 地区
    userNote: String, // 用户笔记
    address: String, // 地址
    appeal: {type: String, default: ''}, // 诉求
    data: {
        '在职月数': {type: Number, default: 0},
        '离职月数': {type: Number, default: 0},
        '月工资': {type: Number, default: 0},
        '降薪数': {type: Number, default: 0},
        '降薪月数': {type: Number, default: 0},
        '拖欠工资月数': {type: Number, default: 0},
        '是否交社保': {type: Boolean, default: false},
        '是否签劳动合同': {type: Boolean, default: false},
        '是否拖欠工资': {type: Boolean, default: false},
        '是否被辞退': {type: Boolean, default: false},
        '是否调岗降薪': {type: Boolean, default: false}
    }, // 收集到的数据
    evidences: Array, // 风险评估
    activationDate: Date, // 激活案件时间
    verifiedDate: Date, // 已完成实名认证时间
    status: { type: Schema.Types.ObjectId, ref: 'ProfileTag' },
    process: [
        {
            processId: String,
            detail: {},
            date: Date
        }
    ],
    templateId: { type: Schema.Types.ObjectId },
    lastProcessFinsihDate: Date,
    contract: {
        unsigned: String,
        userSigned: String,
        completed: String,
        downloadUserSigned: String,
        downloadCompleted: String
    },
    consultFinished: {
        status: { type: Boolean, default: false },
        detail: { type: String, default: '' }
    },
    dialog: [
        {
            content: String, // 对话内容
            type: { // 对话类型，message为用户消息，reply为FMM回复消息
                type: String,
                enum: ['message', 'reply']
            },
            createdAt: Date // 对话产生时间
        }
    ], // intercom对话详情
    isDeleted: { type: Boolean, default: false }
}, {
    strict: false,
    timestamps: true
})

// validations for user schema

const Model = mongoose.model('User', schema, 'user')

module.exports = Model
