import { hexToRgb } from '@layouts/utils'

// 👉 Colors variables
const colorVariables = themeColors => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
  const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
  const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
  const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`
  
  return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
}

export const apexCharConfigMetadatos = themeColors => {
  const { themeBorderColor, themeDisabledTextColor } = colorVariables(themeColors)
  
  return {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    //colors: ['#00cfe8'],
    dataLabels: { 
      enabled: false
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        barHeight: '30%',
        horizontal: true,
        startingShape: 'rounded',
      },
    },
    grid: {
      borderColor: themeBorderColor,
      xaxis: {
        lines: { show: false },
      },
      padding: {
        top: -10,
      },
    },
    yaxis: {
      labels: {
        style: { colors: themeDisabledTextColor },
      },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: themeBorderColor },
      categories: ['MON, 11', 'THU, 14', 'FRI, 15', 'MON, 18', 'WED, 20', 'FRI, 21', 'MON, 23'],
      labels: {
        style: { colors: themeDisabledTextColor },
      },
    },
  }
}
