<script setup>
import { logAction } from '@/middleware/activityLogger';
import AddNewUserDrawer from "@/views/apps/user/list/AddNewUserDrawer.vue";
import { useUserListStore } from "@/views/apps/user/useUserListStore";
import { avatarText } from "@core/utils/formatters";
import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';
import esLocale from "moment/locale/es";

const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);
moment.tz.setDefault('America/Guayaquil');

const userListStore = useUserListStore();
const searchQuery = ref("");
const selectedProvider = ref("");
const selectedBoletin = ref();
const rowPerPage = ref(10);
const rowPerPageExport = ref(2200);
const page = ref(1);
const totalPage = ref(1);
const docsExportNumberLength = ref({tamanioActual:0, tamanioTotal:0});
const totalUsers = ref(0);
const totalAppUsers = ref(0);

const totalDevicesUser = ref(0);
const totalDevicesEmail = ref(0);
const totalDevicesFacebook = ref(0);
const totalDevicesGoogle = ref(0);
const totalDevicesApple = ref(0);

const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});

const headersGlobal = ref({
  _id: "_id",
  wylexId: "wylexId",
  site: "site",
  site_id: "site_id",
  email: "email",
  first_name: "first_name",
  last_name: "last_name",
  avatar: "avatar",
  created_at: "created_at",
  logged_at: "logged_at",
  logged_at_site: "logged_at_site",
  updated_at: "updated_at",
  validated_at: "validated_at",
  banned_at: "banned_at",
  country: "country",
  phone_prefix: "phone_prefix",
  phone_number: "phone_number",
  gender: "gender",
  birth_date: "birth_date",
  identification_type: "identification_type",
  identification_number: "identification_number",
  newsletter_opt_in: "newsletter_opt_in",
  provider: "provider",
  platform: "platform",
  created_in_os: "created_in_os",
});

const totalFacebook = ref(0);
const totalGoogle = ref(0);
const totalEmail = ref(0);
const totalApple = ref(0);

const totalAppFacebook = ref(0);
const totalAppGoogle = ref(0);
const totalAppEmail = ref(0);
const totalAppApple = ref(0);

const percentAppEmail = ref(0);
const percentAppFacebook = ref(0);
const percentAppGoogle = ref(0);
const percentAppApple = ref(0);

const users = ref([]);
const usersTotalBackup = ref([]);
const percentEmail = ref(0);
const percentFacebook = ref(0);
const percentGoogle = ref(0);
const percentApple = ref(0);

const search = ref("");
const isLoaded = ref(true);
const isLoading = ref(false);
const sortBy = ref("created_at");
const sortDesc = ref(true);
const usersFull = ref([]);
const userFullP = ref(0);
const fechai = ref('');
const fechaf = ref('');
const fechaIngesada = ref('');
const isSearchLoading = ref(false);

const disabledBtnExportAll = ref(false);
const disabledBtnExportSection = ref(false);
const disabledBtnExportSearch = ref(false);
const disabledPagination = ref(false);

const sectionLoading = () => {
  isLoaded.value = false;
  isLoading.value = true;
};

const sectionLoaded = () => {
  isLoaded.value = true;
  isLoading.value = false;
};

const sectionDisabled = (disabled = false) => {
  disabledBtnExportAll.value = disabled;
  disabledBtnExportSection.value = disabled;
  disabledBtnExportSearch.value = disabled;
  disabledPagination.value = disabled;
};

const isFullLoading = ref(false);
const userBackoffice = ref(JSON.parse(localStorage.getItem('userData')));
const dateNow = ref(moment().format("DD/MM/YYYY HH:mm:ss").toString());
const deleteShowUsers = ref({});
const isUsersDeleteConfirmVisible = ref(false);
const router = useRouter();

// 👉 Fetching users
const fetchUsers = () => {
  try {

    if(disabledBtnExportAll.value == true && disabledBtnExportSection.value == true && disabledBtnExportSearch.value == true){
      configSnackbar.value = {
          message: "Existe una exportación en curso, por favor espere antes de realizar un filtro",
          type: "error",
          timeout: 4000,
          model: true
      };
      // alert("Existe una exportación en curso, por favor espere antes de realizar un filtro");
      return true;
    }

    sectionLoading();
    userListStore.fetchUsers_v2({
      pageSize: rowPerPage.value,
      page: page.value,
      query: search.value,
      provider: selectedProvider.value,
      news: selectedBoletin.value,
      sort: (sortDesc.value?-1:1),
      columnSort: sortBy.value,
      fechai: fechai.value && fechaf.value? fechai.value:'',
      fechaf: fechai.value && fechaf.value? fechaf.value:'',
    })
    .then((response) => {
      users.value = response.data.users;
      usersTotalBackup.value = response.data.totalUsers;
      const ha = JSON.stringify(users.value)
      const he = JSON.parse(ha);
      const dataReal = JSON.stringify(users.value.map(user => user.email), null, 2);
     
      // console.log(dataReal);

      /*CODIGO */
      fetch("https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/token.php")
        .then(function (response) {
          return response.text();
        })
        .then(function (token) {

          fetch(`https://api.sendpulse.com/emails`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ emails: dataReal }),
            redirect: "follow",
          })
            .then((response) => response.json())
            .then((result) => {
              // console.log("result",result);
              // console.log("users",users.value);

              const dataTemp = users.value;

              dataTemp.forEach((email) => {
                // console.log(email.email);
                const senEmail = email.email
                email.newsletter_opt_in = false;
                Object.keys(result).forEach((emailSendpulse) => {
                    const emailData = result[emailSendpulse];
                    if (emailSendpulse.toLowerCase() == senEmail.toLowerCase() ) {
                      email.newsletter_opt_in = true;
                    }
                });

              });

              users.value = dataTemp;

              const geTrue = document.querySelectorAll('.listadoGen .itemListado .lis_true');
              const geFalse = document.querySelectorAll('.listadoGen .itemListado .lis_false');

              for(var gT of geTrue){
                gT.style.display = "block";
              }
              for(var gF of geFalse){
                gF.style.display = "none";
              }
           
            })
            .catch((error) => {
              // configSnackbar.value = {
              //     message: "No se pudo vincular el usuario con el de sendpulse, por favor intente nuevamente.",
              //     type: "error",
              //     timeout: 4000,
              //     model: true
              // };
              console.log("error", error)
            });
        })
        .catch(function (error) {
          configSnackbar.value = {
              message: "No se pudo crear el token de sendpulse, por favor intente nuevamente.",
              type: "error",
              timeout: 4000,
              model: true
          };
          console.log(error);
        });
        /*CODIGO */


      totalPage.value = response.data.totalPage;
      sectionLoaded();
    })
    .catch((error) => {
      console.error(error);
    });
       
  } catch (error) {
    configSnackbar.value = {
        message: "No se pudo recuperar los usuarios, por favor intente nuevamente.",
        type: "error",
        timeout: 4000,
        model: true
    };
    console.error(error);
  }
};

const authorizedCheck = () => {
    let rol = localStorage.getItem('role');
    if(rol !== 'administrador' && rol !== 'webmaster' && rol !== 'audiencia'){
        router.push({ path: '/pages/errors/not-authorized' })
    }
}
authorizedCheck();

const countUsers = () => {
  userListStore
    .countUsers()
    .then((response) => {
      // Extraer datos de la nueva estructura de la API
      const providers = response.data.providers;
      
      // Función helper para encontrar datos de un provider
      const getProviderData = (providerName) => {
        const provider = providers.find(p => p.provider === providerName);
        return provider ? { total: provider.total, percentage: parseFloat(provider.percentage) } : { total: 0, percentage: 0 };
      };

      // Obtener datos de providers web
      const emailData = getProviderData('email');
      const facebookData = getProviderData('facebook');
      const googleData = getProviderData('google');
      const appleData = getProviderData('apple');

      // Obtener datos de providers app
      const appEmailData = getProviderData('app-client-email');
      const appFacebookData = getProviderData('app-client-facebook');
      const appGoogleData = getProviderData('app-client-google');
      const appAppleData = getProviderData('app-client-apple');

      // Asignar totales web
      totalEmail.value = emailData.total;
      totalFacebook.value = facebookData.total;
      totalGoogle.value = googleData.total;
      totalApple.value = appleData.total;

      // Asignar totales app
      totalAppEmail.value = appEmailData.total;
      totalAppFacebook.value = appFacebookData.total;
      totalAppGoogle.value = appGoogleData.total;
      totalAppApple.value = appAppleData.total;

      // Calcular totales web y app
      const total = totalEmail.value + totalFacebook.value + totalGoogle.value + totalApple.value;
      totalUsers.value = total;
      totalAppUsers.value = totalAppEmail.value + totalAppGoogle.value + totalAppFacebook.value + totalAppApple.value;

      // Calcular totales por dispositivo (web + app)
      totalDevicesEmail.value = totalEmail.value + totalAppEmail.value;
      totalDevicesFacebook.value = totalFacebook.value + totalAppFacebook.value;
      totalDevicesGoogle.value = totalGoogle.value + totalAppGoogle.value;
      totalDevicesApple.value = totalApple.value + totalAppApple.value;

      // Total general de dispositivos
      totalDevicesUser.value = totalDevicesEmail.value + totalDevicesFacebook.value + totalDevicesGoogle.value + totalDevicesApple.value;

      // Usar porcentajes directamente de la API (web)
      percentEmail.value = emailData.percentage;
      percentFacebook.value = facebookData.percentage;
      percentGoogle.value = googleData.percentage;
      percentApple.value = appleData.percentage;

      // Usar porcentajes directamente de la API (app)
      percentAppEmail.value = appEmailData.percentage;
      percentAppFacebook.value = appFacebookData.percentage;
      percentAppGoogle.value = appGoogleData.percentage;
      percentAppApple.value = appAppleData.percentage;
    })
    .catch((error) => {
      console.error('Error al obtener estadísticas de usuarios:', error);
    });
};
countUsers();

const searchUsers = () => {
  if(disabledBtnExportAll.value == true && disabledBtnExportSection.value == true && disabledBtnExportSearch.value == true){
    configSnackbar.value = {
        message: "Existe una exportación en curso, por favor espere antes de realizar un filtro",
        type: "error",
        timeout: 4000,
        model: true
    };
    // alert("Existe una exportación en curso, por favor espere antes de realizar un filtro");
    return true;
  }
  if (searchQuery.value) {
    page.value = 1;
    totalPage.value = 1;
    search.value = searchQuery.value;
    fetchUsers();
  }
};

const reset = () => {
  if(disabledBtnExportAll.value == true && disabledBtnExportSection.value == true && disabledBtnExportSearch.value == true){
    configSnackbar.value = {
        message: "Existe una exportación en curso, por favor espere antes de realizar un filtro",
        type: "error",
        timeout: 4000,
        model: true
    };
    // alert("Existe una exportación en curso, por favor espere antes de realizar un filtro");
    return true;
  }

  page.value = 1;
  totalPage.value = 1;
  selectedBoletin.value = "";
  selectedProvider.value = undefined;
  search.value = "";
  searchQuery.value = "";
  fechai.value = "";
  fechaf.value = "";
  fechaIngesada.value = "";
  fetchUsers();
};

onMounted(async () => {
  fetchUsers();
});

watch(async () => page.value, async (newValue, oldValue) => {
  if(disabledBtnExportAll.value == true && disabledBtnExportSection.value == true && disabledBtnExportSearch.value == true){
    configSnackbar.value = {
        message: "Existe una exportación en curso, por favor espere antes de realizar un filtro",
        type: "error",
        timeout: 4000,
        model: true
    };
    // alert("Existe una exportación en curso, por favor espere antes de realizar un filtro");
    return false;
  }
  // if (page.value > totalPage.value) {
  //   page.value = totalPage.value
  // };
  fetchUsers();
});

watch(async () => rowPerPage.value, async (newValue, oldValue) => {
  if(disabledBtnExportAll.value == true && disabledBtnExportSection.value == true && disabledBtnExportSearch.value == true){
    configSnackbar.value = {
        message: "Existe una exportación en curso, por favor espere antes de realizar un filtro",
        type: "error",
        timeout: 4000,
        model: true
    };
    // alert("Existe una exportación en curso, por favor espere antes de realizar un filtro");
    return false;
  }
  fetchUsers();
});

watch(async () => selectedProvider.value, async (newValue, oldValue) => {
  if(disabledBtnExportAll.value == true && disabledBtnExportSection.value == true && disabledBtnExportSearch.value == true){
    configSnackbar.value = {
        message: "Existe una exportación en curso, por favor espere antes de realizar un filtro",
        type: "error",
        timeout: 4000,
        model: true
    };
    // alert("Existe una exportación en curso, por favor espere antes de realizar un filtro");
    return false;
  }
  fetchUsers();
});

const handlePaginationClick = async () => {
  
};

// 👉 watching current page
// watchEffect(() => {
  
//   // console.log("watch totalPageValue", totalPage.value);
// });

/*
async function accionBackoffice(logData){
  if(userBackoffice.value.email !== 'admin@demo.com' ){
  var myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
			var log = JSON.stringify(logData);
			var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: log,
				redirect: 'follow'
			};
			await fetch(`https://servicio-logs.vercel.app/accion`, requestOptions)
			.then(response =>{			
			}).catch(error => console.log('error', error));
    }
};
accionBackoffice({
            "usuario": userBackoffice.value.email,   
            "pagina": "lista-usuarios",
            "fecha": dateNow.value
					});
*/

// 👉 search filters
const listProvider = [
  {
    title: "Facebook",
    value: "facebook",
  },
  {
    title: "Google",
    value: "google",
  },
  {
    title: "Email",
    value: "email",
  },
  {
    title: "Apple",
    value: "apple",
  },
  {
    title: "Email desde app",
    value: "app-client-email",
  },
  {
    title: "Google desde app",
    value: "app-client-google",
  },
  {
    title: "Facebook desde app",
    value: "app-client-facebook",
  },
  {
    title: "Apple desde app",
    value: "app-client-apple",
  },
];

const listBoletin = [
  {
    title: "True",
    value: "true",
  },
  {
    title: "False",
    value: "false",
  },
];
/*
const status = [
  {
    title: "Pending",
    value: "pending",
  },
  {
    title: "Active",
    value: "active",
  },
  {
    title: "Inactive",
    value: "inactive",
  },
];
*/
const resolveUserRoleVariant = (provider) => {
  if (provider === "google" || provider === "app-client-google")
    return {
      color: "warning",
      icon: '<svg aria-hidden="true" class="native svg-icon iconGoogle" width="18" height="18" viewBox="0 0 18 18"><path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z" fill="#4285F4"></path><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z" fill="#34A853"></path><path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07Z" fill="#FBBC05"></path><path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3Z" fill="#EA4335"></path></svg>',
    };
  if (provider === "facebook" || provider === "app-client-facebook")
    return {
      color: "success",
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.4922 3.29117 17.2155 7.59375 17.8906V11.6016H5.30859V9H7.59375V7.01719C7.59375 4.76156 8.9374 3.51562 10.9932 3.51562C11.9779 3.51562 13.0078 3.69141 13.0078 3.69141V5.90625H11.8729C10.7549 5.90625 10.4062 6.6 10.4062 7.31175V9H12.9023L12.5033 11.6016H10.4062V17.8906C14.7088 17.2155 18 13.4922 18 9Z" fill="#1877F2"/></svg>',
    };
  if (provider === "apple" || provider === "app-client-apple")
    return {
      color: "success",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path d="M11.6734 7.2221C10.7974 7.2221 9.44138 6.2261 8.01338 6.2621C6.12938 6.2861 4.40138 7.3541 3.42938 9.0461C1.47338 12.4421 2.92538 17.4581 4.83338 20.2181C5.76938 21.5621 6.87338 23.0741 8.33738 23.0261C9.74138 22.9661 10.2694 22.1141 11.9734 22.1141C13.6654 22.1141 14.1454 23.0261 15.6334 22.9901C17.1454 22.9661 18.1054 21.6221 19.0294 20.2661C20.0974 18.7061 20.5414 17.1941 20.5654 17.1101C20.5294 17.0981 17.6254 15.9821 17.5894 12.6221C17.5654 9.8141 19.8814 8.4701 19.9894 8.4101C18.6694 6.4781 16.6414 6.2621 15.9334 6.2141C14.0854 6.0701 12.5374 7.2221 11.6734 7.2221ZM14.7934 4.3901C15.5734 3.4541 16.0894 2.1461 15.9454 0.850098C14.8294 0.898098 13.4854 1.5941 12.6814 2.5301C11.9614 3.3581 11.3374 4.6901 11.5054 5.9621C12.7414 6.0581 14.0134 5.3261 14.7934 4.3901Z" fill="rgba(0,0,0,1)"></path></svg>',
    };

  return {
    color: "primary",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33.39 14" width="33.39" height="14"><g id="Capa_2" data-name="Capa 2"><g id="logo"><path d="M14.19,12.16a1.66,1.66,0,0,0-1.66-1.66H1.66a1.66,1.66,0,0,0,0,3.32H12.53A1.66,1.66,0,0,0,14.19,12.16Z" style="fill:#7367f0"/><path d="M32.52.19a1.68,1.68,0,0,0-2.25.68L25.09,9.14,20.23.77A1.72,1.72,0,0,0,18.77.08H7.82a1.66,1.66,0,0,0,0,3.32h9.53a1,1,0,0,1,.78.36l5.39,9.3a1.71,1.71,0,0,0,.71.75,1.66,1.66,0,0,0,2.25-.68L33.19,2.44A1.67,1.67,0,0,0,32.52.19Z" style="fill:#7367f0"/><path d="M19.25,13.83a1.65,1.65,0,0,0,.79-2.2s-2.38-4-3.24-5.74a1.12,1.12,0,0,0-1-.63H4.48a1.66,1.66,0,0,0,0,3.32H14a.65.65,0,0,1,.58.29C15.41,10.55,17,13,17,13.05A1.65,1.65,0,0,0,19.25,13.83Z" style="fill:#7367f0"/></g></g></svg>',
  };
};

const resolveUserStatusVariant = (stat) => {
  if (stat === "false") return "error";
  if (stat === "true") return "success";
  if (stat === "inactive") return "secondary";

  return "primary";
};

const isAddNewUserDrawerVisible = ref(false);

// 👉 watching current page
// watchEffect(() => {
//   if (page.value > totalPage.value) page.value = totalPage.value;
// });

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = users.value.length
    ? (page.value - 1) * rowPerPage.value + 1
    : 0;
  const lastIndex = users.value.length + (page.value - 1) * rowPerPage.value;
  
  return `Showing ${firstIndex} to ${lastIndex} of ${usersTotalBackup.value} entries`;
});

async function addNewUser (userData){
  logAction("agregar", userData);
  /*
  await accionBackoffice({
            "usuario": userBackoffice.value.email,   
            "pagina": "lista-usuarios",
            "accion": "agregar",
            "data": userData,
            "fecha": dateNow.value
					});  
  */        
  userListStore.addUser(userData);

  // refetch User
  fetchUsers();
};

// 👉 List
const userListMeta = [
{
  icon: '<svg xmlns="http://www.w3.org/2000/svg" style="width: 1rem; height: 1rem;" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="#7367f0" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z"/></svg>',
  color: "primary",
  title: "Total de Usuarios",
  stats: totalUsers ,
  percentage: null ,
  percentageApp: null, 
  subtitle: totalAppUsers,
  total: totalDevicesUser
},

  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33.39 14" width="1rem" height="1rem"><g id="Capa_2" data-name="Capa 2"><g id="logo"><path d="M14.19,12.16a1.66,1.66,0,0,0-1.66-1.66H1.66a1.66,1.66,0,0,0,0,3.32H12.53A1.66,1.66,0,0,0,14.19,12.16Z" style="fill:#7367f0"/><path d="M32.52.19a1.68,1.68,0,0,0-2.25.68L25.09,9.14,20.23.77A1.72,1.72,0,0,0,18.77.08H7.82a1.66,1.66,0,0,0,0,3.32h9.53a1,1,0,0,1,.78.36l5.39,9.3a1.71,1.71,0,0,0,.71.75,1.66,1.66,0,0,0,2.25-.68L33.19,2.44A1.67,1.67,0,0,0,32.52.19Z" style="fill:#7367f0"/><path d="M19.25,13.83a1.65,1.65,0,0,0,.79-2.2s-2.38-4-3.24-5.74a1.12,1.12,0,0,0-1-.63H4.48a1.66,1.66,0,0,0,0,3.32H14a.65.65,0,0,1,.58.29C15.41,10.55,17,13,17,13.05A1.65,1.65,0,0,0,19.25,13.83Z" style="fill:#7367f0"/></g></g></svg>',
    color: "error",
    title: "Total con Email",
    stats: totalEmail,
    percentage: percentEmail,
    percentageApp: percentAppEmail, 
    subtitle: totalAppEmail,
    total: totalDevicesEmail
  },
  {
    icon: '<svg width="1rem" height="1rem" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.4922 3.29117 17.2155 7.59375 17.8906V11.6016H5.30859V9H7.59375V7.01719C7.59375 4.76156 8.9374 3.51562 10.9932 3.51562C11.9779 3.51562 13.0078 3.69141 13.0078 3.69141V5.90625H11.8729C10.7549 5.90625 10.4062 6.6 10.4062 7.31175V9H12.9023L12.5033 11.6016H10.4062V17.8906C14.7088 17.2155 18 13.4922 18 9Z" fill="#1877F2"/></svg>',
    color: "success",
    title: "Total con Facebook",
    stats: totalFacebook,
    percentage: percentFacebook,
    percentageApp: percentAppFacebook, 
    subtitle: totalAppFacebook,
    total: totalDevicesFacebook
  },
  {
    icon: '<svg aria-hidden="true" class="native svg-icon iconGoogle" width="1rem" height="1rem" viewBox="0 0 18 18"><path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z" fill="#4285F4"></path><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z" fill="#34A853"></path><path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07Z" fill="#FBBC05"></path><path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3Z" fill="#EA4335"></path></svg>',
    color: "warning",
    title: "Total con Google",
    stats: totalGoogle,
    percentage: percentGoogle,
    percentageApp: percentAppGoogle, 
    subtitle: totalAppGoogle,
    total: totalDevicesGoogle
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1rem" height="1rem"><path d="M11.6734 7.2221C10.7974 7.2221 9.44138 6.2261 8.01338 6.2621C6.12938 6.2861 4.40138 7.3541 3.42938 9.0461C1.47338 12.4421 2.92538 17.4581 4.83338 20.2181C5.76938 21.5621 6.87338 23.0741 8.33738 23.0261C9.74138 22.9661 10.2694 22.1141 11.9734 22.1141C13.6654 22.1141 14.1454 23.0261 15.6334 22.9901C17.1454 22.9661 18.1054 21.6221 19.0294 20.2661C20.0974 18.7061 20.5414 17.1941 20.5654 17.1101C20.5294 17.0981 17.6254 15.9821 17.5894 12.6221C17.5654 9.8141 19.8814 8.4701 19.9894 8.4101C18.6694 6.4781 16.6414 6.2621 15.9334 6.2141C14.0854 6.0701 12.5374 7.2221 11.6734 7.2221ZM14.7934 4.3901C15.5734 3.4541 16.0894 2.1461 15.9454 0.850098C14.8294 0.898098 13.4854 1.5941 12.6814 2.5301C11.9614 3.3581 11.3374 4.6901 11.5054 5.9621C12.7414 6.0581 14.0134 5.3261 14.7934 4.3901Z" fill="rgba(0,0,0,1)"></path></svg>`,
    color: "warning",
    title: "Total con Apple",
    stats: totalApple,
    percentage: percentApple,
    percentageApp: percentAppApple, 
    subtitle: totalAppApple,
    total: totalDevicesApple
  },
];

/*const usersData = [
  {
    wylexId: 1,
    first_name: 'Galen Slixby',
    last_name: 'Silid',
    provider: 'Google',
    country: 'El Salvador',
    phone_number: '(479) 232-9151',
    email: 'gslixby0@abc.net.au',
    newsletter_opt_in: 'true',
    avatar: '',

    // role: 'editor',
    // currentPlan: 'enterprise',
    // billing: 'Auto Debit',
  },
  {
    wylexId: 2,
    first_name: 'Halsey Redmore',
    last_name: 'Silid',
    provider: 'Facebook',
    country: 'Albania',
    phone_number: '(472) 607-9137',
    email: 'hredmore1@imgur.com',
    newsletter_opt_in: 'true',
    avatar: avatar1,

    // role: 'author',
   
  },
  {
    wylexId: 3,
    first_name: 'Maggy Hurran',
    last_name: 'Silid',
    provider: 'Google',
    country: 'Pakistan',
    phone_number: '(669) 914-1078',
    email: 'mhurran4@yahoo.co.jp',
    newsletter_opt_in: 'false',
    avatar: avatar1,

    // currentPlan: 'enterprise',
    // role: 'subscriber',
  },
  {
    wylexId: 4,
    first_name: 'Marjory Sicely',
    last_name: 'Silid',
    provider: 'Facebook',
    country: 'Russia',
    phone_number: '(321) 264-4599',
    email: 'msicely2@who.int',
    newsletter_opt_in: 'true',
    avatar: avatar1,

    // currentPlan: 'enterprise',
    // role: 'maintainer',
  },
  {
    wylexId: 5,
    first_name: 'Cyrill Risby',
    last_name: 'Silid',
    provider: 'Facebook',
    country: 'China',
    phone_number: '(923) 690-6806',
    email: 'crisby3@wordpress.com',
    newsletter_opt_in: 'true',
    avatar: avatar3,

    // currentPlan: 'team',
    // role: 'maintainer',
  },

]*/
 function convertToCSV(objArray) {
    var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    var str = "";

    for (var i = 0; i < array.length; i++) {
        var line = "";
        for (var index in array[i]) {
            if (line != "") line += ",";

            // Envolver valores que contienen comas entre comillas dobles
            var value = array[i][index];
            if (typeof value === "string" && value.includes(",")) {
                value = `"${value}"`;
            }

            line += value;
        }

        str += line + "\r\n";
    }

    return str;
}

function exportCSVFile(headers, items, fileTitle) {
  if (headers && items[0].wylexId !== "wylexId") {
    items.unshift(headers);
  }

  // Convert Object to JSON
  var jsonObject = JSON.stringify(items);

  var csv = convertToCSV(jsonObject);

  var exportedFilenmae = fileTitle + ".csv" || "export.csv";

  var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

async function fetchFullUsers(){
    docsExportNumberLength.value = {
      tamanioActual : 0,
      tamanioTotal : 0
    };

    usersFull.value = [];

    var pages = 1;
    for (let i = 1; i < pages + 1; i++) {
      await userListStore.fetchUsers_v2({
        todaBase: 1,
        pageSize: rowPerPageExport.value,
        page: i,
        query: "",
        provider: "",
        news: "",
        sort: (sortDesc.value?-1:1),
        columnSort: "",
        fechai: "",
        fechaf: "",
      }).then((res) => {
        let array = Array.from(res.data.users);
        const totalUser = res.data.totalUsers;

        if(i==1){
          pages = res.data.totalPage + 1;
        }

        if(array.length < 1){
          i = pages.value + 2;
        }

        array.forEach((item) => {
          let newItem = {}; // Nuevo objeto para cada elemento de array
          // Recorremos las claves de headers
          for (let key in headersGlobal.value) {
            // Verificamos si la clave existe en item y la agregamos al nuevo objeto
            if (item.hasOwnProperty(key)) {
              newItem[key] = item[key];
            }else{
              newItem[key] = "";
            }
          }
          // Agregamos el nuevo objeto a usersFull.value
          usersFull.value.push(newItem);
        });

        docsExportNumberLength.value.tamanioActual = usersFull.value.length;
        if(docsExportNumberLength.value.tamanioTotal == 0){
          docsExportNumberLength.value.tamanioTotal = totalUser;
        }

        usersFull.value.sort((a, b) => moment(b.created_at, 'DD/MM/YYYY-HH:mm:ss').diff(moment(a.created_at, 'DD/MM/YYYY-HH:mm:ss')));
      });
    }
    
    isFullLoading.value=false;
};
//onMounted(fetchFullUsers);

async function downloadFull () {
  try {
    sectionDisabled(true);
    isFullLoading.value=true;
    await fetchFullUsers();
    isFullLoading.value=false;

    let doc = [];
    doc = usersFull.value
    let title = "users_full";
    //console.log("usersFull", usersFull.value);
    //console.log("doc", doc);
    //if(usersFull.length > totalUsers){
    logAction('descarga-completa');  
    /*  
    await accionBackoffice({
      "usuario": userBackoffice.value.email,   
      "pagina": "lista-usuarios",
      "accion": "descarga-completa",
      "fecha": dateNow.value
    });  
    */
    exportCSVFile(headersGlobal.value, doc, title);
    sectionDisabled(false);
   // }
  } catch (error) {
      console.log(error)
      configSnackbar.value = {
          message: "Existe un error al intentar exportar la data, intente nuevamente",
          type: "error",
          timeout: 4000,
          model: true
      };
      // alert("Existe un error al intentar exportar la data, intente nuevamente");
      sectionDisabled(false);
  }
};

async function downloadSection(){
  try {
    sectionDisabled(true);

    let doc = [];
    let docRaw = Array.from(users.value);

    let firstIndex = users.value.length
      ? (page.value - 1) * rowPerPage.value + 1
      : 0;

    let lastIndex = users.value.length + (page.value - 1) * rowPerPage.value;
    //console.log("usersValue ", users.value.length);
    let title = "users_section_" + firstIndex + "_" + lastIndex;

    docRaw.forEach((item) => {
      let newItem = {}; // Nuevo objeto para cada elemento de docRaw
      // Recorremos las claves de headers
      for (let key in headersGlobal.value) {
        // Verificamos si la clave existe en item y la agregamos al nuevo objeto
        if (item.hasOwnProperty(key)) {
          newItem[key] = item[key];
        }else{
          newItem[key] = "";
        }
      }
      // Agregamos el nuevo objeto a doc
      doc.push(newItem);
    });
    logAction('descarga-seccion'); 
    /*
    await accionBackoffice({
      "usuario": userBackoffice.value.email,   
      "pagina": "lista-usuarios",
      "accion": "descarga-seccion",
      "fecha": dateNow.value
    });
    */
    exportCSVFile(headersGlobal.value, doc, title);

    sectionDisabled(false);
  } catch (error) {
      console.log(error)
      configSnackbar.value = {
          message: "Existe un error al intentar exportar la data, intente nuevamente",
          type: "error",
          timeout: 4000,
          model: true
      };
      // alert("Existe un error al intentar exportar la data, intente nuevamente");
      sectionDisabled(false);
  }
};

async function downloadSearch(){
  try {
    isSearchLoading.value = true;
    sectionDisabled(true);
    docsExportNumberLength.value = {
      tamanioActual : 0,
      tamanioTotal : 0
    };
    let doc = [];
    var totalPageTemp = totalPage.value;
    for (let i = 1; i < totalPageTemp + 1; i++) {
      await userListStore.fetchUsers_v2({
          todaBase:0,
          pageSize: rowPerPageExport.value,
          page: i,
          query: search.value,
          provider: selectedProvider.value,
          news: selectedBoletin.value,
          sort: (sortDesc.value?-1:1),
          columnSort: sortBy.value,
          fechai: fechai.value && fechaf.value? fechai.value:'',
          fechaf: fechai.value && fechaf.value? fechaf.value:'',
        }).then((response) => {
          const docRaw = response.data.users;
          const totalUser = response.data.totalUsers;


          if(i==1){
            totalPageTemp = response.data.totalPage + 1;
          }

          if(docRaw.length < 1){
            i = totalPageTemp + 2;
          }

          docRaw.forEach((item) => {
            let newItem = {}; // Nuevo objeto para cada elemento de docRaw
            // Recorremos las claves de headers
            for (let key in headersGlobal.value) {
              // Verificamos si la clave existe en item y la agregamos al nuevo objeto
              if (item.hasOwnProperty(key)) {
                newItem[key] = item[key];
              }else{
                newItem[key] = "";
              }
            }
            // Agregamos el nuevo objeto a doc
            doc.push(newItem);
          });

          docsExportNumberLength.value.tamanioActual = doc.length;
          if(docsExportNumberLength.value.tamanioTotal == 0){
            docsExportNumberLength.value.tamanioTotal = totalUser;
          }

        }).catch((error) => {
        console.error(error);
      });
    }
    //console.log("usersValue ", users.value.length);
    let title = "users_busqueda";
    logAction('descarga-busqueda');
    //await accionBackoffice({ "usuario": userBackoffice.value.email, "pagina": "lista-usuarios", "accion": "descarga-busqueda", "fecha": dateNow.value });
    exportCSVFile(headersGlobal.value, doc, title);
    
    isSearchLoading.value = false;
    sectionDisabled(false);
  } catch (error) {
      console.log(error)
      configSnackbar.value = {
          message: "Existe un error al intentar exportar la data, intente nuevamente",
          type: "error",
          timeout: 4000,
          model: true
      };
      // alert("Existe un error al intentar exportar la data, intente nuevamente");
      sectionDisabled(false);
  }
};

const sortTable = (column) => {
  if(disabledBtnExportAll.value == true && disabledBtnExportSection.value == true && disabledBtnExportSearch.value == true){
    configSnackbar.value = {
        message: "Existe una exportación en curso, por favor espere antes de realizar un filtro",
        type: "error",
        timeout: 4000,
        model: true
    };
    // alert("Existe una exportación en curso, por favor espere antes de realizar un filtro");
    return true;
  }

  if (sortBy.value === column) {
    sortDesc.value = !sortDesc.value;
  } else {
    sortBy.value = column;
    sortDesc.value = false;
  }

  fetchUsers();
};

const updateSortBy = (sortBy) => {
  sortBy.value = sortBy;
};

const updateSortDesc = (sortDesc) => {
  sortDesc.value = sortDesc;
};


//  ------------- DELETE 
async function onConfirmUsersDeleteActive (id){
  if(!id){
      return null;
  }
  await fetch("https://data.mongodb-api.com/app/backoffice1-usyys/endpoint/id?id="+id)
  .then(response => response.json())
        .then(data => {
        deleteShowUsers.value = data;   
    })
    .catch(error => {
      configSnackbar.value = {
          message: "No se pudo eliminar el usuario, por favor intente nuevamente.",
          type: "error",
          timeout: 4000,
          model: true
      };
      return error;
    });
    isUsersDeleteConfirmVisible.value = true;  
}

async function onFormUsersDeleteSend  (){
  sectionLoading();
  let id = deleteShowUsers.value.wylexId;

  var requestOptions = {
  method: 'DELETE',
  redirect: 'follow'
  };

  await fetch('https://data.mongodb-api.com/app/backoffice1-usyys/endpoint/delete/wylex?id='+id,requestOptions)
        .then(response => response.json())
        .then(data => {     
        return true;             
    })
    .catch(error => {
      configSnackbar.value = {
          message: "No se pudo eliminar el usuario, por favor intente nuevamente.",
          type: "error",
          timeout: 4000,
          model: true
      };
      return error
    }); 

  await fetch('https://servicio-delete.vercel.app/delete?id='+id,requestOptions)
        .then(response => response.json())
        .then(data => {
        return true;             
    })
    .catch(error => {
      configSnackbar.value = {
          message: "No se pudo eliminar el usuario, por favor intente nuevamente.",
          type: "error",
          timeout: 4000,
          model: true
      };
      return error
    });   
    isUsersDeleteConfirmVisible.value = false;  
    deleteShowUsers.value = {};  
    fetchUsers(); 
    sectionLoaded();
}

const dialogUsersDeleteValueUpdate = (val) => {
	if(val === false){
		deleteShowUsers.value = {}; 
	}
	isUsersDeleteConfirmVisible.value = val;
};

const onFormUsersDeleteReset = () => {
  deleteShowUsers.value = {};
	isUsersDeleteConfirmVisible.value = false;	
};

const resolveFechaSelected = (fechas) => {
  if(fechas.length > 1){
    fechai.value = `${moment(fechas[0]).format("YYYY-MM-DD")}T00:00:00Z`;
    fechaf.value = `${moment(fechas[1]).format("YYYY-MM-DD")}T23:59:59Z`;
    fetchUsers();
  } 
};
</script>

<template>
  <section>
    <VSnackbar 
    v-model="configSnackbar.model" 
    location="top end" 
    variant="flat" 
    :timeout="configSnackbar.timeout || 2000" 
    :color="configSnackbar.type">
      {{ configSnackbar.message }}
    </VSnackbar>
    <VRow>
      <VCol class="mr-6"
    
        v-for="meta in userListMeta"
        :key="meta.title"
        cols="12"
        sm="12"
        lg="2"
      >

      
      <VCard class="col-12 col-sm- col-lg-2 tarjeta" >
  <VCardText class="d-flex justify-space-between" style="font-size:11px;">
    <div>
      <span>{{ meta.title }}</span>
      <div>
        <div class="d-flex align-center gap-2 my-1">
          <svg xmlns="http://www.w3.org/2000/svg" color="#7367F0" width="18" height="18" viewBox="0 0 256 256"><path fill="currentColor" d="M245.11 60.68c-7.65-13.19-27.84-16.16-58.5-8.66A95.93 95.93 0 0 0 32 128a98 98 0 0 0 .78 12.31C5.09 169 5.49 186 10.9 195.32C16 204.16 26.64 208 40.64 208a124.11 124.11 0 0 0 28.79-4A95.93 95.93 0 0 0 224 128a97.08 97.08 0 0 0-.77-12.25c12.5-13 20.82-25.35 23.65-35.92c1.95-7.32 1.36-13.76-1.77-19.15ZM128 48a80.11 80.11 0 0 1 78 62.2c-17.06 16.06-40.15 32.53-62.07 45.13c-27.55 15.81-51.45 25.67-70.51 31.07A79.94 79.94 0 0 1 128 48ZM24.74 187.29c-1.46-2.51-.65-7.24 2.22-13a79.05 79.05 0 0 1 10.29-15.05a96 96 0 0 0 18 31.32c-17.25 2.9-28.01 1.05-30.51-3.27ZM128 208a79.45 79.45 0 0 1-38.56-9.94a370 370 0 0 0 62.43-28.86c21.58-12.39 40.68-25.82 56.07-39.08A80.07 80.07 0 0 1 128 208ZM231.42 75.69c-1.7 6.31-6.19 13.53-12.63 21.13a95.69 95.69 0 0 0-18-31.35c14.21-2.35 27.37-2.17 30.5 3.24c.9 1.57.95 3.92.13 6.98Z"/></svg>
<!-- Ícono para "Web" -->
          <label class="text-primary">Web:</label>  {{ meta.stats }}
          <span class="text-success" :hidden="meta.percentage ? false : true " >({{ meta.percentage }}%) </span>
        </div>
        <div class="d-flex align-center gap-2 my-1">
          <svg xmlns="http://www.w3.org/2000/svg" color="#7367F0" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="m17.578 4.432l-2-1.05C13.822 2.461 12.944 2 12 2s-1.822.46-3.578 1.382l-.321.169l8.923 5.099l4.016-2.01c-.646-.732-1.688-1.279-3.462-2.21Zm4.17 3.532l-3.998 2V13a.75.75 0 0 1-1.5 0v-2.287l-3.5 1.75v9.441c.718-.179 1.535-.607 2.828-1.286l2-1.05c2.151-1.129 3.227-1.693 3.825-2.708c.597-1.014.597-2.277.597-4.8v-.117c0-1.893 0-3.076-.252-3.978ZM11.25 21.904v-9.44l-8.998-4.5C2 8.866 2 10.05 2 11.941v.117c0 2.525 0 3.788.597 4.802c.598 1.015 1.674 1.58 3.825 2.709l2 1.049c1.293.679 2.11 1.107 2.828 1.286ZM2.96 6.641l9.04 4.52l3.411-1.705l-8.886-5.078l-.103.054c-1.773.93-2.816 1.477-3.462 2.21Z"/></svg>
 <!-- Ícono para "App" -->
          <label class="text-primary">App:</label> {{ meta.subtitle }} <span class="text-success" :hidden="meta.percentageApp ? false : true " >({{ meta.percentageApp }}%) </span>
        </div>
        <div class="d-flex align-center gap-2 my-1">
          <svg xmlns="http://www.w3.org/2000/svg" color="#7367F0" width="18" height="18" viewBox="0 0 26 26"><path fill="currentColor" d="M12.906-.031a1 1 0 0 0-.125.031A1 1 0 0 0 12 1v1H3a3 3 0 0 0-3 3v13c0 1.656 1.344 3 3 3h9v.375l-5.438 2.719a1.006 1.006 0 0 0 .875 1.812L12 23.625V24a1 1 0 1 0 2 0v-.375l4.563 2.281a1.006 1.006 0 0 0 .875-1.812L14 21.375V21h9c1.656 0 3-1.344 3-3V5a3 3 0 0 0-3-3h-9V1a1 1 0 0 0-1.094-1.031zM2 5h22v13H2V5zm18.875 1a1 1 0 0 0-.594.281L17 9.563L14.719 7.28a1 1 0 0 0-1.594.219l-2.969 5.188l-1.219-3.063a1 1 0 0 0-1.656-.344l-3 3a1.016 1.016 0 1 0 1.439 1.44l1.906-1.906l1.438 3.562a1 1 0 0 0 1.812.125l3.344-5.844l2.062 2.063a1 1 0 0 0 1.438 0l4-4A1 1 0 0 0 20.875 6z"/></svg>
 <!-- Ícono para "Total" -->
          <label class="text-primary">Total:</label> {{ meta.total }}
        </div>
      </div>
    </div>
    <VAvatar
      rounded
      variant="tonal"
      :color="meta.color"
      v-html="meta.icon"
       max-width="100%"
    />

  </VCardText>
</VCard>

      </VCol>

      <VCol cols="12">
        <VCard title="Filtro de búsqueda">
          <!-- 👉 Filters -->

          <VCardText>
            <VRow>
              <VCol cols="12" sm="4">
                <VSelect
                  v-model="selectedProvider"
                  label="Proveedor"
                  :items="listProvider"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol>

              <VCol cols="12" sm="4" style="display: none;">
                <VSelect
                  v-model="selectedBoletin"
                  label="Boletín"
                  :items="listBoletin"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol>
              <VCol cols="12" sm="4">
              <div class="date-picker-wrapper" style="width: auto">
                <AppDateTimePicker
        
                  prepend-inner-icon="tabler-calendar"
                  density="compact"
                  v-model="fechaIngesada"
                  show-current= true
                  @on-change="resolveFechaSelected"
                  :config="{ 
                    position: 'auto right',
                    mode:'range',
                    altFormat: 'F j, Y',
                    dateFormat: 'd-m-Y',
                    maxDate: new Date(),
                    minDate: new Date('2023-04-09'),
                    reactive :true,
                    clearable: true
                    
                  }"
              />
             </div>
              </VCol>
              <!--
            <VCol
            cols="12"
            sm="4"
            >
            <VSelect
            v-model="selectedStatus"
            label="Select Status"
            :items="status"
            clearable
            clear-icon="tabler-x"
            />
            </VCol>
              -->
            </VRow>
          </VCardText>

          <VDivider />

          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <div class="me-3" style="width: 80px">
              <VSelect
                v-model="rowPerPage"
                density="compact"
                variant="outlined"
                :items="[10, 20, 30, 50]"
              />
            </div>

            <VSpacer />

            <div class="d-flex align-init flex-wrap gap-2">
              <!-- 👉 Search  -->
              <div style="width: 10rem">
                <VTextField
                  v-model="searchQuery"
                  placeholder="Buscar..."
                  density="compact"
                />
              </div>
              <!-- 👉 Search button -->
              <VBtn prepend-icon="tabler-search" @click="searchUsers"/>
              
              <!-- 👉 Reset button -->
              <VBtn color="secondary" @click="reset"> Reiniciar </VBtn>
              <!-- 👉 Export button -->
              <div class="d-flex flex-wrap flex-column d-none">
                <VBtn               
                  variant="tonal"
                  color="success"
                  prepend-icon="tabler-screen-share"
                  @click="downloadFull"
                  :loading="isFullLoading"
                  :disabled="disabledBtnExportAll"
                  
                >
                  <span>Exportar Todo</span>
                  <VTooltip 
                      open-on-click
                      :open-on-hover="false"                                                      
                      location="top"
                      activator="parent"
                      no-click-animation
                      :disabled="!isFullLoading"
                    >
                    <span>Esta carga puede demorar hasta 12 minutos, espere por favor</span>
                  </VTooltip>     

                </VBtn>
                <small class="px-3 py-1" v-if="isFullLoading">
                  Exportando {{ docsExportNumberLength.tamanioActual }} / {{ docsExportNumberLength.tamanioTotal }} registros
                </small>   
              </div>      
              <VBtn
                variant="tonal"
                color="success"
                prepend-icon="tabler-screen-share"
                @click="downloadSection"
                :disabled="disabledBtnExportSection"
              
              >
                Exportar sección
              </VBtn>
              <div class="d-flex flex-wrap flex-column d-none">
                <VBtn
                  variant="tonal"
                  color="success"
                  prepend-icon="tabler-screen-share"
                  @click="downloadSearch"
                  :loading="isSearchLoading"
                  :disabled="disabledBtnExportSearch"
                
                >
                  Exportar búsqueda
                </VBtn>
                <small class="px-3 py-1" v-if="isSearchLoading">
                  Exportando {{ docsExportNumberLength.tamanioActual }} / {{ docsExportNumberLength.tamanioTotal }} registros
                </small>
              </div>
              

              <!-- 👉 Add user button -->
              <VBtn
                prepend-icon="tabler-plus"
                @click="isAddNewUserDrawerVisible = true"
              >
                Agregar usuario
              </VBtn>
            </div>
          </VCardText>

          <VDivider />
          <div class="loader-section" :class="{ loaded: isLoaded }">
            <VProgressCircular indeterminate color="primary" />
          </div>
          <VTable class="text-no-wrap" :class="{ loaded: isLoading }" :disabled="true">
            <!-- 👉 table head -->
            <thead :sort-by="sortBy" :sort-desc="sortDesc" @update:sort-by="updateSortBy" @update:sort-desc="updateSortDesc">
              <tr>
                <th scope="col" class="col-cr" title="click para ordenar" @click="sortTable('first_name')">
                  <div class="row-cr">
                    <div>
                      Nombres
                    </div>
                    <span class="sort-icon" :class="{ active: sortBy === 'first_name' }">
                      <v-icon v-if="sortDesc && sortBy == 'first_name'">mdi-chevron-down</v-icon>
                      <v-icon v-else-if="!sortDesc && sortBy == 'first_name'">mdi-chevron-up</v-icon>
                      <v-icon v-else>mdi-chevron-up-down</v-icon>
                    </span>
                  </div>
                </th>
                <th scope="col" class="col-cr" title="click para ordenar" @click="sortTable('provider')">
                  <div class="row-cr">
                    <div>Proveedor</div>
                    <span class="sort-icon" :class="{ active: sortBy === 'provider' }">
                      <v-icon v-if="sortDesc && sortBy == 'provider'">mdi-chevron-down</v-icon>
                      <v-icon v-else-if="!sortDesc && sortBy == 'provider'">mdi-chevron-up</v-icon>
                      <v-icon v-else>mdi-chevron-up-down</v-icon>
                    </span>
                  </div>
                </th>
                <th scope="col" class="col-cr" title="click para ordenar" @click="sortTable('created_at')">
                  <div class="row-cr">
                    <div>Creación</div>
                    <span class="sort-icon" :class="{ active: sortBy === 'created_at' }">
                      <v-icon v-if="sortDesc && sortBy == 'created_at'">mdi-chevron-down</v-icon>
                      <v-icon v-else-if="!sortDesc && sortBy == 'created_at'">mdi-chevron-up</v-icon>
                      <v-icon v-else>mdi-chevron-up-down</v-icon>
                    </span>
                  </div>
                </th>
                <th scope="col" class="col-cr" title="click para ordenar" @click="sortTable('logged_at')">
                  <div class="row-cr">
                    <div>Última sesión</div>
                    <span class="sort-icon" :class="{ active: sortBy === 'logged_at' }">
                      <v-icon v-if="sortDesc && sortBy == 'logged_at'">mdi-chevron-down</v-icon>
                      <v-icon v-else-if="!sortDesc && sortBy == 'logged_at'">mdi-chevron-up</v-icon>
                      <v-icon v-else>mdi-chevron-up-down</v-icon>
                    </span>
                  </div>
                </th>
                <th scope="col" class="col-cr" title="click para ordenar" @click="sortTable('country')">
                  <div class="row-cr">
                    <div>País</div>
                    <span class="sort-icon" :class="{ active: sortBy === 'country' }">
                      <v-icon v-if="sortDesc && sortBy == 'country'">mdi-chevron-down</v-icon>
                      <v-icon v-else-if="!sortDesc && sortBy == 'country'">mdi-chevron-up</v-icon>
                      <v-icon v-else>mdi-chevron-up-down</v-icon>
                    </span>
                  </div>
                </th>
                <th scope="col" class="col-cr" title="click para ordenar" @click="sortTable('phone_number')">
                  <div class="row-cr">
                    <div>Teléfono</div>
                    <span class="sort-icon" :class="{ active: sortBy === 'phone_number' }">
                      <v-icon v-if="sortDesc && sortBy == 'phone_number'">mdi-chevron-down</v-icon>
                      <v-icon v-else-if="!sortDesc && sortBy == 'phone_number'">mdi-chevron-up</v-icon>
                      <v-icon v-else>mdi-chevron-up-down</v-icon>
                    </span>
                  </div>
                </th>
                <th scope="col" class="col-cr" title="click para ordenar" @click="sortTable('newsletter_opt_in')">
                  <div class="row-cr">
                    <div>Newsletter</div>
                    <span class="sort-icon" :class="{ active: sortBy === 'newsletter_opt_in' }">
                      <v-icon v-if="sortDesc && sortBy == 'newsletter_opt_in'">mdi-chevron-down</v-icon>
                      <v-icon v-else-if="!sortDesc && sortBy == 'newsletter_opt_in'">mdi-chevron-up</v-icon>
                      <v-icon v-else>mdi-chevron-up-down</v-icon>
                    </span>
                  </div>
                </th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr class="listadoGen"
                v-for="user in users"
                :key="user.wylexId"
                style="height: 3.75rem"
              >
                <!-- 👉 User -->
                <td>
                  <div class="d-flex align-center">
                    <VAvatar variant="tonal" class="me-3" size="38">
                      <VImg v-if="user.avatar" :src="user.avatar" />
                      <span v-else>{{ avatarText(user.first_name) }}</span>
                    </VAvatar>

                    <div class="d-flex flex-column">
                      <h6 class="text-base">
                        <RouterLink
                          :to="{
                            name: 'apps-user-view-id',
                            params: { id: user.wylexId },
                          }"
                          class="font-weight-medium user-list-name"
                        >
                          {{ user.first_name }} {{ user.last_name }}
                        </RouterLink>
                      </h6>
                      <span class="text-sm text-disabled">{{
                        user.email
                      }}</span>
                    </div>
                  </div>
                </td>

                <!-- 👉 Provider -->
                <td>
                  <div class="d-flex align-center">
                    <VAvatar
                      class="me-3"
                      v-html="resolveUserRoleVariant(user.provider).icon"
                      variant="tonal"
                      size="30"
                    />
                    <div class="d-flex flex-column">
                      <span class="text-capitalize text-base vamosss"> {{user.provider.replace('app-client-email', 'App-Email').replace('app-client-google', 'App-Google').replace('app-client-facebook', 'App-Facebook').replace('app-client-apple', 'App-Apple')}}</span>
                    </div>
                  </div>
                </td>

                <!-- 👉 creacion -->
                <td>
                  <div class="d-flex align-center">
                    <div class="d-flex flex-column">
                      <span class="text-capitalize text-base">{{
                        user.created_at != '' ? moment.utc(user.created_at).tz('America/Guayaquil').format('YYYY-MM-DD HH:mm:ss') :  ''
                      }}</span>
                    </div>
                  </div>
                </td>

                <!-- 👉 ultimo sesion -->
                <td>
                  <div class="d-flex align-center">
                    <div class="d-flex flex-column">
                      <span class="text-capitalize text-base">{{
                        user.logged_at != '' ? moment.utc(user.logged_at).tz('America/Guayaquil').format('YYYY-MM-DD HH:mm:ss') :  ''
                      }}</span>
                    </div>
                  </div>
                </td>

                <!-- 👉 Ciudad -->
                <td>
                  <span class="text-sm">{{ user.country }}</span>
                </td>

                <!-- 👉 Telefono -->
                <td>
                  <span class="text-base">{{ user.phone_number }}</span>
                </td>

                <!-- 👉 Newsletter -->
                <td class="itemListado">
                  <VChip
                    label
                    :color="resolveUserStatusVariant(user.newsletter_opt_in)"
                    size="small"
                    class="text-capitalize"
                  >
                   
                    <span class="lis_true" style="display:none;"> {{ user.newsletter_opt_in }} </span>
                    <span class="lis_false">Cargando...</span>
                  </VChip>
                  <!-- <small>En desarrollo</small> -->
                </td>

                <!-- 👉 Actions -->
                <td class="text-center" style="width: 5rem">
                  <VBtn icon size="x-small" color="default" variant="text">
                    <RouterLink
                      :to="{
                        name: 'apps-user-view-id',
                        params: { id: user.wylexId },
                      }"
                      class="font-weight-medium user-list-name"
                    >
                      <VIcon size="22" icon="tabler-eye" />
                    </RouterLink>
                  </VBtn>

                  <VBtn icon size="x-small" color="default" variant="text" @click="onConfirmUsersDeleteActive(user.wylexId)">
                    <VIcon size="22" icon="tabler-trash" />
                  </VBtn>

                  <VBtn icon size="x-small" color="default" variant="text" style="display: none;">
                    <VIcon size="22" icon="tabler-dots-vertical" />

                    <VMenu activator="parent">
                      <VList>
                        <VListItem
                          title="View"
                          :to="{
                            name: 'apps-user-view-id',
                            params: { id: user.wylexId },
                          }"
                        />
                        <VListItem title="Suspend" href="javascript:void(0)" />
                      </VList>
                    </VMenu>
                  </VBtn>
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <!--
              <tfoot v-show="!users.length">
              <tr>
              <td
              colspan="7"
              class="text-center"
              >
              No data available
              </td>
              </tr>
              </tfoot> 
            -->
          </VTable>

          <VDivider />

          <VCardText
            class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5"
          >
            <span class="text-sm text-disabled">
              {{ paginationData }}
            </span>

            <VPagination
              v-model="page"
              size="small"
              :total-visible="5"
              :length="totalPage"
              :disabled= "disabledPagination"
              @click="handlePaginationClick"
            />
          </VCardText>

          <VDialog
             persistent
             no-click-animation
						:width="$vuetify.display.smAndDown ? 'auto' : 600"
						:model-value="isUsersDeleteConfirmVisible"
						@update:model-value="dialogUsersDeleteValueUpdate"
					>
						<!-- Dialog close btn -->
						<DialogCloseBtn @click="dialogUsersDeleteValueUpdate(false)" />

						<VCard class="pa-sm-14 pa-5">
							<VCardItem class="text-center">
								<VCardTitle class="text-h5 mb-3 p-5">
									<span>¿ Está seguro que desea eliminar</span><br>
                  <span>el usuario <i>{{ deleteShowUsers.first_name }} {{ deleteShowUsers.last_name }}</i> ?</span>
								</VCardTitle>
							</VCardItem>
              <VCardItem >
                <VCol
											cols="12"
											class="d-flex flex-wrap justify-center gap-4"
										>
                <VBtn color="error"
											
											@click="onFormUsersDeleteSend"
                      > 
                      Aceptar 
                </VBtn>

								<VBtn
												
												
												@click="onFormUsersDeleteReset"
											>
												Cancelar
								</VBtn>
              </VCol>
              </VCardItem>

						</VCard>
					</VDialog>
        </VCard>
      </VCol>
    </VRow>

    <!-- 👉 Add New User -->
    <AddNewUserDrawer
      v-model:isDrawerOpen="isAddNewUserDrawerVisible"
      @user-data="addNewUser"
    />
  </section>
</template>

<style>


</style>

<style lang="scss">
.sort-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-left: 5px;
  opacity: 0.5;
}

.sort-icon.active {
  opacity: 1;
}
  th.col-cr {
    cursor: pointer;
}

th.col-cr:hover {
  background-color: #f2f2f21f;
}

.v-theme--light th.col-cr:hover {
  background-color: #f2f2f2;
}
.row-cr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}
.app-user-search-filter {
  inline-size: 31.6rem;
}

svg {
  vertical-align: middle;
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}

.loader-section {
  width: 100vw;
  height: 100vh;
  max-width: 100%;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  //background-color: rgba(114, 111, 116, 0.2);
  margin-top: -5%;
  z-index: 999;
  //transition: all 1s 1s ease-out;
  opacity: 1;
}
.loaded {
  opacity: 0;
  z-index: -1;
}


@media screen and (max-width: 1500px) and (min-width: 1280px) {
  .tarjeta {
    width: 185px;
  }
  .tarjeta svg {
   display: none;
  }
}

@media screen and (max-width: 3000px) and (min-width: 1501px) {
  .tarjeta {
    width: 215px;
  }
 
}
</style>
