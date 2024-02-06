<script setup>
    import Moment from 'moment';
    import { extendMoment } from 'moment-range';
    import esLocale from "moment/locale/es.js";

    import { useTheme } from 'vuetify';
    import { useThemeConfig } from '@core/composable/useThemeConfig'
    const { theme } = useThemeConfig()
    const vuetifyTheme = useTheme()
    const fechaText = ref("")
    const vuetifyThemesName = Object.keys(vuetifyTheme.themes.value);
    const moment = extendMoment(Moment);
    const isSnackbarVisible = ref(false);
    // moment.locale('es', [esLocale]);

    moment.lang('es', {
          months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
          monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
          weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
          weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
          weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
        }
    );

    moment.locale('es');

    const isDialogDateRange = ref(false);
    const isModeDarkDate = ref(false);

    const obtenerFechaDispositivos = function (selectedDates, dateStr, instance){
        //var respJson = await nuevoArchivoJson(archivoJson);
        if(selectedDates.length > 1){
          alert()
        }
    }

    import { ref } from 'vue';
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'

    const date = ref();
    const datepicker = ref(null);

    const formatDate = "YYYY-MM-DD";
    const dateValues = ref({
        fechai:null,
        fechaf:null,
    });
    const formatDateLang = "dddd, DD [de] MMMM [de] YYYY";
    const fecha = ref({
        i:null,
        f:null,
        title:"",
    });
    const btnsDate = ref([null, null, null, null, null, null]);
    const onRangeStart = (value) => {
        if(fecha.value.i){
            fecha.value.f = null;
        }
        fecha.value.i = value;
        // onFormatDateSubmit(value)
      // alert(`Selected date in range is: ${value}`);
    }
    const onRangeEnd = (value) => {
        fecha.value.f = value;
        // onFormatDateSubmit(value)
      // alert(`Range selected with the second date: ${value}`);
    }

    const emit = defineEmits([
      'get:dateCR',
    ])

    const onFormatDateSubmit = () => {
        var fi = moment(fecha.value.i);
        var ff = moment(fecha.value.f);
        if(!isValidDaysLimit({fechai:fi,fechaf:ff})){
            return false;
        }

        fecha.value.title = `${fi.format(formatDateLang)} - ${ff.format(formatDateLang)}`;
        activeBtns(-1);

        dateValues.value.fechai = fi;
        dateValues.value.fechaf = ff;

        // nextTick(() => {
        //     emit('get:dateCR', [fi.format(formatDate), ff.format(formatDate)])
        // })
    }

    
    
    const isValidDaysLimit = (json = {}) => {
      const {fechai = null, fechaf} = json;
      var fi = moment(fechai);
      var ff = moment(fechaf);
        if(ff.diff(fi, 'days') > 15){
            if (datepicker) {
                // Close the menu programmatically
                datepicker.value.clearValue()
            }
            // alert("No puede sobrepasar el límite de 15 días");
            isSnackbarVisible.value = true;
            return false;
        }
        return true;
    }

    const activeBtns = (p) => {
        // btnsDate.value[0] = "primary";
        if(p==-1){
            for(var i in btnsDate.value){
                btnsDate.value[i] = "light";
            }
        }else{

            if (datepicker) {
                // Close the menu programmatically
                datepicker.value.clearValue()
            }

            for(var i in btnsDate.value){
                if(p == i){
                    btnsDate.value[i] = "primary";
                }else{
                    btnsDate.value[i] = "light";
                }
            }
        }
    }

    const hoyFuncion = () => {
        var fi = moment();
        var ff = moment();
        
        fecha.value.title = `${fi.format(formatDateLang)} - ${ff.format(formatDateLang)}`;
        activeBtns(0);

        dateValues.value.fechai = fi;
        dateValues.value.fechaf = ff;

        // nextTick(() => {
        //     emit('get:dateCR', [fi.format(formatDate), ff.format(formatDate)])
        // })

        return [fi, ff];
    }

    const ayerFuncion = () => {
        var fi = moment().subtract(1, 'days');
        var ff = moment().subtract(1, 'days');

        fecha.value.title = `${fi.format(formatDateLang)} - ${ff.format(formatDateLang)}`;
        activeBtns(1);

        dateValues.value.fechai = fi;
        dateValues.value.fechaf = ff;

        // nextTick(() => {
        //     emit('get:dateCR', [fi.format(formatDate), ff.format(formatDate)])
        // })
        return [fi, ff];
    }

    const hace7Funcion = () => {
        var fi = moment().subtract(6, 'days');
        var ff = moment();

        fecha.value.title = `${fi.format(formatDateLang)} - ${ff.format(formatDateLang)}`;
        activeBtns(2);

        dateValues.value.fechai = fi;
        dateValues.value.fechaf = ff;

        // nextTick(() => {
        //     emit('get:dateCR', [fi.format(formatDate), ff.format(formatDate)])
        // })
        return [fi, ff];
    }

    const hace15Funcion = () => {
        var fi = moment().subtract(15, 'days');
        var ff = moment();

        fecha.value.title = `${fi.format(formatDateLang)} - ${ff.format(formatDateLang)}`;
        activeBtns(5);

        dateValues.value.fechai = fi;
        dateValues.value.fechaf = ff;

        // nextTick(() => {
        //     emit('get:dateCR', [fi.format(formatDate), ff.format(formatDate)])
        // })
        return [fi, ff];
    }

    const esteMesFuncion = () => {
        var fi = moment().startOf('month');
        var ff = moment().endOf('month');

        fecha.value.title = `${fi.format(formatDateLang)} - ${ff.format(formatDateLang)}`;
        activeBtns(3);

        dateValues.value.fechai = fi;
        dateValues.value.fechaf = ff;

        // nextTick(() => {
        //     emit('get:dateCR', [fi.format(formatDate), ff.format(formatDate)])
        // })
        return [fi, ff];
    }

    const mesPasadoFuncion = () => {
        var fi = moment().subtract(1, 'month').startOf('month');
        var ff = moment().subtract(1, 'month').endOf('month');

        fecha.value.title = `${fi.format(formatDateLang)} - ${ff.format(formatDateLang)}`;
        activeBtns(4);

        dateValues.value.fechai = fi;
        dateValues.value.fechaf = ff;

        // nextTick(() => {
        //     emit('get:dateCR', [fi.format(formatDate), ff.format(formatDate)])
        // })
        return [fi, ff];
    }

    const aplicarFechasSugmit = () => {
        if(dateValues.value.fechai == null && dateValues.value.fechaf == null && fecha.value.i == null && fecha.value.f == null){
            return false;
        }else{
            isDialogDateRange.value = false;
            var fi = dateValues.value.fechai;
            var ff = dateValues.value.fechaf;

            fechaText.value = `${dateValues.value.fechai.format(formatDate)}, ${dateValues.value.fechaf.format(formatDate)}`;

            nextTick(() => {
                emit('get:dateCR', [fi.format(formatDate), ff.format(formatDate)])
            })
        }
        
    }

    watch(async () => fecha.value.i, async () => {
        if(fecha.value.i && fecha.value.f){
            onFormatDateSubmit()
        }
    });

    watch(async () => fecha.value.f, async () => {
        if(fecha.value.i && fecha.value.f){
            onFormatDateSubmit()
        }
    });

    const updateThemeClassInCalendar = activeTheme => {
        isModeDarkDate.value = activeTheme;
    }

    watch(theme, updateThemeClassInCalendar)
    onMounted(() => {
      updateThemeClassInCalendar(vuetifyTheme.name.value)
    })

</script>
<template>
  <VSnackbar v-model="isSnackbarVisible" :timeout="5000" location="top" variant="flat" color="warning">
    No puede sobrepasar el límite de 15 días
  </VSnackbar>
    <VDialog v-model="isDialogDateRange" class="dialog-calendar" persistent max-width="750">
        <!-- Dialog Activator -->
        <template #activator="{ props }">
            <div class="d-flex" style="flex-direction: column;">
                <VTextField
                    style="min-width: 240px;width: auto;"
                    v-bind="props"
                    v-model="fechaText"
                    prepend-inner-icon="mdi-calendar-month"
                    label="Seleccione una fecha"
                    placeholder="Ingrese una fecha"
                />

                <!-- <VBtn class="text-capitalize font-weight-normal" v-bind="props" color="primary">
                  Seleccionar fecha
                    <VIcon
                    end
                    icon="mdi-chevron-down"
                  />
                </VBtn> -->

                <small v-if="fecha.title" style="font-size: 10px;" class="text-capitalize font-weight-light mt-1"> {{ fechaText }} </small>
            </div>
        </template>

        <!-- Dialog close btn -->
        <DialogCloseBtn @click="isDialogDateRange = !isDialogDateRange" />

        <!-- Dialog Content -->
        <VCard title="Seleccione la fecha de preferencia">
          <VCardText>
            <VRow>
              <VCol cols="12" sm="3" md="3" class="liner-divider-calendar">
                <div class="space-divider">
                    <VBtn @click="hoyFuncion" variant="text"  :color="btnsDate[0]" block class="text-left text-capitalize font-weight-normal mb-2">
                      Hoy
                    </VBtn>
                    <VBtn @click="ayerFuncion" variant="text" :color="btnsDate[1]" block class="text-left text-capitalize font-weight-normal mb-2">
                      Ayer
                    </VBtn>
                    <VBtn @click="hace7Funcion" variant="text" :color="btnsDate[2]" block class="text-left text-capitalize font-weight-normal mb-2">
                      Hace 7 días
                    </VBtn>
                    <VBtn @click="hace15Funcion" variant="text" :color="btnsDate[5]" block class="text-left text-capitalize font-weight-normal mb-2">
                      Hace 15 días
                    </VBtn>
                    <VBtn @click="esteMesFuncion" variant="text" :color="btnsDate[3]" block class="text-left text-capitalize font-weight-normal mb-2">
                      Este mes
                    </VBtn>
                    <VBtn @click="mesPasadoFuncion" variant="text" :color="btnsDate[4]" block class="text-left text-capitalize font-weight-normal mb-2">
                      El mes pasado
                    </VBtn>
                </div>
              </VCol>
              <VCol cols="12" sm="9" md="9" >
                <VueDatePicker :min-date="moment('2022-01-01')" :max-date="new Date()" calendar-cell-class-name="dp-custom-cell-date" menu-class-name="dp-custom-menu-date" locale="es" v-model="date" ref="datepicker" range multi-calendars inline auto-apply :enable-time-picker="false" @range-start="onRangeStart" @range-end="onRangeEnd" :dark="isModeDarkDate=='dark'"></VueDatePicker>
                <!-- <AppDateTimePicker
                  prepend-inner-icon="tabler-calendar"
                  @on-change="obtenerFechaDispositivos"
                  :config="{ 
                    inline: true,
                    mode:'range',
                    altFormat: 'F j, Y',
                    dateFormat: 'm-d-Y',
                    maxDate: new Date()
                  }"
                /> -->
              </VCol>
              <VCol cols="12" sm="12" md="12">
                <h5 class="font-weight-light text-right">{{fecha.title}}</h5>
              </VCol>
            </VRow>
          </VCardText>

          <VCardText class="d-flex justify-end flex-wrap gap-3">
            <VBtn
              variant="tonal"
              color="secondary"
              @click="isDialogDateRange = false"
            >
              Cancelar
            </VBtn>
            <VBtn @click="aplicarFechasSugmit">
              Aplicar
            </VBtn>
          </VCardText>
        </VCard>
  </VDialog>
</template>
<style lang="scss">
    .dp-custom-menu-date {
        border-color: #fff;
    }

    .dp-custom-menu-date div.dp__calendar_item .dp__range_end,
    .dp-custom-menu-date div.dp__calendar_item .dp__range_start{
        --v-theme-overlay-multiplier: var(--v-theme-primary-overlay-multiplier);
        background: rgb(var(--v-theme-primary)) !important;
        background-color: rgb(var(--v-theme-primary)) !important;
        color: rgb(var(--v-theme-on-primary)) !important;
    }
    .liner-divider-calendar {
        border-right: 1px solid #ddd;
    }
    .dp__theme_dark {
        --dp-background-color: rgb(var(--v-theme-surface));
        --dp-text-color: #fff;
        --dp-hover-color: #484848;
        --dp-hover-text-color: #fff;
        --dp-hover-icon-color: #959595;
        --dp-primary-color: #005cb2;
        --dp-primary-disabled-color: #61a8ea;
        --dp-primary-text-color: #fff;
        --dp-secondary-color: #a9a9a9;
        --dp-border-color: #2d2d2d;
        --dp-menu-border-color: #2d2d2d;
        --dp-border-color-hover: #aaaeb7;
        --dp-disabled-color: #737373;
        --dp-disabled-color-text: #d0d0d0;
        --dp-scroll-bar-background: #212121;
        --dp-scroll-bar-color: #484848;
        --dp-success-color: #00701a;
        --dp-success-color-disabled: #428f59;
        --dp-icon-color: #959595;
        --dp-danger-color: #e53935;
        --dp-marker-color: #e53935;
        --dp-tooltip-color: #3e3e3e;
        --dp-highlight-color: rgb(0 92 178 / 20%);
        --dp-range-between-dates-background-color: var(--dp-hover-color, #484848);
        --dp-range-between-dates-text-color: var(--dp-hover-text-color, #fff);
        --dp-range-between-border-color: var(--dp-hover-color, #fff);
    }
</style>