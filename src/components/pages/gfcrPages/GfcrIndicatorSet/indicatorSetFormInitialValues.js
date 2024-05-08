const getIndicatorSetFormInitialValues = (indicatorSet) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const {
    title = '',
    report_date = today.toISOString().split('T')[0],
    report_year = today.getFullYear(),
    f1_1 = '0',
    f2_1a = '0',
    f2_1b = '0',
    f2_2a = '0',
    f2_2b = '0',
    f2_3a = '0',
    f2_3b = '0',
    f2_4 = '0',
    f2_opt1 = '0',
  } = indicatorSet ?? {}

  return {
    title,
    report_date,
    report_year,
    f1_1,
    f2_1a,
    f2_1b,
    f2_2a,
    f2_2b,
    f2_3a,
    f2_3b,
    f2_4,
    f2_opt1,
  }
}

export { getIndicatorSetFormInitialValues }
