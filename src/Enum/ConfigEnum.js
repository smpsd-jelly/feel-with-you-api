const ConfigCode = Object.freeze({
    _QUESTION_SCORE: 'QUESTION_SCORE',
    _QUESTION_GROUP: 'QUESTION_GROUP'
});

const ConfigQuestionGroup = Object.freeze({
    _GROUP_1: 'GROUP_1',
    _GROUP_2: 'GROUP_2',
    _GROUP_3: 'GROUP_3',
    _GROUP_4: 'GROUP_4',
});

const ConfigQuestionScore = Object.freeze({
    _QUESTION_SCORE_1: '1',
    _QUESTION_SCORE_2: '2',
    _QUESTION_SCORE_3: '3',
});

// Use module.exports instead of export const
module.exports = {
    ConfigCode,
    ConfigQuestionGroup,
    ConfigQuestionScore
};