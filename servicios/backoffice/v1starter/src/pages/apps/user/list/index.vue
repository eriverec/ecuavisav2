<script setup>
import AddNewUserDrawer from "@/views/apps/user/list/AddNewUserDrawer.vue";
import { useUserListStore } from "@/views/apps/user/useUserListStore";
import { avatarText } from "@core/utils/formatters";

import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";


const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

const userListStore = useUserListStore();
const searchQuery = ref("");
const selectedProvider = ref("");
const selectedBoletin = ref();
const rowPerPage = ref(10);
const page = ref(1);
const totalPage = ref(1);
const totalUsers = ref(0);
const totalFacebook = ref(0);
const totalGoogle = ref(0);
const totalEmail = ref(0);
const users = ref([]);
const percentEmail = ref(0);
const percentFacebook = ref(0);
const percentGoogle = ref(0);
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

const sectionLoading = () => {
  isLoaded.value = false;
  isLoading.value = true;
};

const sectionLoaded = () => {
  isLoaded.value = true;
  isLoading.value = false;
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
  sectionLoading();
  userListStore
    .fetchUsers({
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
      totalPage.value = response.data.totalPage;
      totalUsers.value = response.data.totalUsers;
      sectionLoaded();
    })
    .catch((error) => {
      console.error(error);
    });
       
  } catch (error) {
    console.error(error);
  }
};

const authorizedCheck = () => {
    let rol = localStorage.getItem('role');
    if(rol !== 'administrador' && rol !== 'webmaster'){
        router.push({ path: '/pages/errors/not-authorized' })
    }
}
authorizedCheck();

const countUsers = () => {
  userListStore
    .countUsers()
    .then((response) => {
      const pE = ref(0);
      const pF = ref(0);
      const pG = ref(0);
      const total = response.data.fullUsers;
      totalEmail.value = response.data.totalEmail;
      totalFacebook.value = response.data.totalFacebook;
      totalGoogle.value = response.data.totalGoogle;

      pE.value = (totalEmail.value * 100) / total;
      percentEmail.value = Math.round((pE.value + Number.EPSILON) * 100) / 100;

      pF.value = (totalFacebook.value * 100) / total;
      percentFacebook.value =
        Math.round((pF.value + Number.EPSILON) * 100) / 100;

      pG.value = (totalGoogle.value * 100) / total;
      percentGoogle.value = Math.round((pG.value + Number.EPSILON) * 100) / 100;
    })
    .catch((error) => {
      console.error(error);
    });
};
countUsers();

const searchUsers = () => {
  if (searchQuery.value) {
    page.value = 1;
    totalPage.value = 1;
    search.value = searchQuery.value;
    fetchUsers();
  }
};

const reset = () => {
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

watchEffect(fetchUsers);

// 👉 watching current page
watchEffect(() => {
  if (page.value > totalPage.value) page.value = totalPage.value;
  //console.log("watch totalPageValue", totalPage.value);
});

async function accionBackoffice (logData){
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
  if (provider === "google")
    return {
      color: "warning",
      icon: '<svg aria-hidden="true" class="native svg-icon iconGoogle" width="18" height="18" viewBox="0 0 18 18"><path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z" fill="#4285F4"></path><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z" fill="#34A853"></path><path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07Z" fill="#FBBC05"></path><path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3Z" fill="#EA4335"></path></svg>',
    };
  if (provider === "facebook")
    return {
      color: "success",
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.4922 3.29117 17.2155 7.59375 17.8906V11.6016H5.30859V9H7.59375V7.01719C7.59375 4.76156 8.9374 3.51562 10.9932 3.51562C11.9779 3.51562 13.0078 3.69141 13.0078 3.69141V5.90625H11.8729C10.7549 5.90625 10.4062 6.6 10.4062 7.31175V9H12.9023L12.5033 11.6016H10.4062V17.8906C14.7088 17.2155 18 13.4922 18 9Z" fill="#1877F2"/></svg>',
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
watchEffect(() => {
  if (page.value > totalPage.value) page.value = totalPage.value;
});

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = users.value.length
    ? (page.value - 1) * rowPerPage.value + 1
    : 0;
  const lastIndex = users.value.length + (page.value - 1) * rowPerPage.value;
  
  return `Showing ${firstIndex} to ${lastIndex} of ${totalUsers.value} entries`;
});

async function addNewUser (userData){
  await accionBackoffice({
            "usuario": userBackoffice.value.email,   
            "pagina": "lista-usuarios",
            "accion": "agregar",
            "data": userData,
            "fecha": dateNow.value
					});  
  userListStore.addUser(userData);

  // refetch User
  fetchUsers();
};

// 👉 List
const userListMeta = [
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="#7367f0" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z"/></svg>',
    color: "primary",
    title: "Total de Usuarios",
    stats: totalUsers,
    percentage: null,
    subtitle: "",
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33.39 14" width="3rem" height="3rem"><g id="Capa_2" data-name="Capa 2"><g id="logo"><path d="M14.19,12.16a1.66,1.66,0,0,0-1.66-1.66H1.66a1.66,1.66,0,0,0,0,3.32H12.53A1.66,1.66,0,0,0,14.19,12.16Z" style="fill:#7367f0"/><path d="M32.52.19a1.68,1.68,0,0,0-2.25.68L25.09,9.14,20.23.77A1.72,1.72,0,0,0,18.77.08H7.82a1.66,1.66,0,0,0,0,3.32h9.53a1,1,0,0,1,.78.36l5.39,9.3a1.71,1.71,0,0,0,.71.75,1.66,1.66,0,0,0,2.25-.68L33.19,2.44A1.67,1.67,0,0,0,32.52.19Z" style="fill:#7367f0"/><path d="M19.25,13.83a1.65,1.65,0,0,0,.79-2.2s-2.38-4-3.24-5.74a1.12,1.12,0,0,0-1-.63H4.48a1.66,1.66,0,0,0,0,3.32H14a.65.65,0,0,1,.58.29C15.41,10.55,17,13,17,13.05A1.65,1.65,0,0,0,19.25,13.83Z" style="fill:#7367f0"/></g></g></svg>',
    color: "error",
    title: "Total con Email",
    stats: totalEmail,
    percentage: percentEmail,
    subtitle: "",
  },
  {
    icon: '<svg width="2rem" height="2rem" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.4922 3.29117 17.2155 7.59375 17.8906V11.6016H5.30859V9H7.59375V7.01719C7.59375 4.76156 8.9374 3.51562 10.9932 3.51562C11.9779 3.51562 13.0078 3.69141 13.0078 3.69141V5.90625H11.8729C10.7549 5.90625 10.4062 6.6 10.4062 7.31175V9H12.9023L12.5033 11.6016H10.4062V17.8906C14.7088 17.2155 18 13.4922 18 9Z" fill="#1877F2"/></svg>',
    color: "success",
    title: "Total con Facebook",
    stats: totalFacebook,
    percentage: percentFacebook,
    subtitle: "",
  },
  {
    icon: '<svg aria-hidden="true" class="native svg-icon iconGoogle" width="2rem" height="2rem" viewBox="0 0 18 18"><path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z" fill="#4285F4"></path><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z" fill="#34A853"></path><path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07Z" fill="#FBBC05"></path><path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3Z" fill="#EA4335"></path></svg>',
    color: "warning",
    title: "Total con Google",
    stats: totalGoogle,
    percentage: percentGoogle,
    subtitle: "",
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

      line += array[i][index];
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

async function fetchFullUsers (){

await userListStore
      .countPageUsers()
      .then(async(response) => {

      let pages = Number(response.data);
      for (let i = 1; i < pages+1; i++) {
        await userListStore.fetchFullUsers(i).then((res) => {   
        
          //console.log('res',res.data)
          let array = Array.from(res.data);
          
          array.forEach((item) => {
            usersFull.value.push({
              wylexId: item.wylexId,
              site: item.site,
              email: item.email,
              first_name: item.first_name,
              last_name: item.last_name,
              avatar: item.avatar,
              // created_at: item.created_at,
              // logged_at: item.logged_at,
              created_at: moment(item.created_at).format('DD/MM/YYYY-HH:mm:ss'),
              logged_at: moment(item.logged_at).format('DD/MM/YYYY-HH:mm:ss'),
              country: item.country,
              phone_prefix: item.phone_prefix,
              phone_number: item.phone_number,
              gender: item.gender,
              birth_date: item.birth_date,
              identification_type: item.identification_type,
              identification_number: item.identification_number,
              newsletter_opt_in: item.newsletter_opt_in,
              provider: item.provider,
            });
          });
          usersFull.value.sort((a, b) => moment(b.created_at, 'DD/MM/YYYY-HH:mm:ss').diff(moment(a.created_at, 'DD/MM/YYYY-HH:mm:ss')));
        });
      }
      
      isFullLoading.value=false;
    }).catch((error) => {
      console.error(error);
    });
};
//onMounted(fetchFullUsers);

async function downloadFull () {
      isFullLoading.value=true;
      await fetchFullUsers();
      isFullLoading.value=false;
       //console.log('usersFull.value',usersFull.value);
      let headers = {
        wylexId: "wylexId",
        site: "site",
        email: "email",
        first_name: "first_name",
        last_name: "last_name",
        avatar: "avatar",
        created_at: "created",
        logged_at: "last_session",
        country: "country",
        phone_prefix: "phone_prefix",
        phone_number: "phone_number",
        gender: "gender",
        birth_date: "birth_date",
        identification_type: "identification_type",
        identification_number: "identification_number",
        newsletter_opt_in: "newsletter_opt_in",
        provider: "provider",
      };
      let doc = [];
      doc = usersFull.value
      let title = "users_full";
      //console.log("usersFull", usersFull.value);
      //console.log("doc", doc);
      //if(usersFull.length > totalUsers){
      await accionBackoffice({
            "usuario": userBackoffice.value.email,   
            "pagina": "lista-usuarios",
            "accion": "descarga-completa",
            "fecha": dateNow.value
					});  
      exportCSVFile(headers, doc, title);
     // }

};

async function downloadSection (){
  let headers = {
    wylexId: "wylexId",
    site: "site",
    email: "email",
    first_name: "first_name",
    last_name: "last_name",
    avatar: "avatar",
    created_at: "created",
    logged_at: "last_session",
    country: "country",
    phone_prefix: "phone_prefix",
    phone_number: "phone_number",
    gender: "gender",
    birth_date: "birth_date",
    identification_type: "identification_type",
    identification_number: "identification_number",
    newsletter_opt_in: "newsletter_opt_in",
    provider: "provider",
  };
  let doc = [];
  let docRaw = Array.from(users.value);

  let firstIndex = users.value.length
    ? (page.value - 1) * rowPerPage.value + 1
    : 0;
  let lastIndex = users.value.length + (page.value - 1) * rowPerPage.value;
  //console.log("usersValue ", users.value.length);
  let title = "users_section_" + firstIndex + "_" + lastIndex;
  docRaw.forEach((item) => {
    doc.push({
      wylexId: item.wylexId,
      site: item.site,
      email: item.email,
      first_name: item.first_name,
      last_name: item.last_name,
      avatar: item.avatar,
      created_at: moment(item.created_at).format('DD/MM/YYYY-HH:mm:ss'),
      logged_at: moment(item.logged_at).format('DD/MM/YYYY-HH:mm:ss'),
      country: item.country,
      phone_prefix: item.phone_prefix,
      phone_number: item.phone_number,
      gender: item.gender,
      birth_date: item.birth_date,
      identification_type: item.identification_type,
      identification_number: item.identification_number,
      newsletter_opt_in: item.newsletter_opt_in,
      provider: item.provider,
    });
  });
  await accionBackoffice({
            "usuario": userBackoffice.value.email,   
            "pagina": "lista-usuarios",
            "accion": "descarga-seccion",
            "fecha": dateNow.value
					});
  exportCSVFile(headers, doc, title);
};

const sortTable = (column) => {
  //sectionLoading();
  //sectionLoaded();
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
  await fetch("https://data.mongodb-api.com/app/backoffice1-usyys/endpoint/id?id="+id)
  .then(response => response.json())
        .then(data => {
        deleteShowUsers.value = data;   
    })
    .catch(error => {return error});
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
    .catch(error => {return error}); 

  await fetch('https://servicio-delete.vercel.app/delete?id='+id,requestOptions)
        .then(response => response.json())
        .then(data => {
        return true;             
    })
    .catch(error => {return error});   
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
    fechai.value = fechas[0].toString();
    fechaf.value = fechas[1].toString();
    console.log("fechas", fechas);
  } 
};
</script>

<template>
  <section>
    <VRow>
      <VCol
        v-for="meta in userListMeta"
        :key="meta.title"
        cols="12"
        sm="6"
        lg="3"
      >
        <VCard>
          <VCardText class="d-flex justify-space-between">
            <div>
              <span>{{ meta.title }}</span>
              <div class="d-flex align-center gap-2 my-1">
                <h6 class="text-h6">
                  {{ meta.stats }}
                </h6>
                <span
                  class="text-success"
                  :hidden="meta.percentage ? false : true"
                  >({{ meta.percentage }}%)
                </span>
              </div>
              <span>{{ meta.subtitle }}</span>
            </div>

            <VAvatar
              rounded
              variant="tonal"
              :color="meta.color"
              v-html="meta.icon"
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

              <VCol cols="12" sm="4">
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

            <div class="d-flex align-center flex-wrap gap-2">
              <!-- 👉 Search  -->
              <div style="width: 10rem">
                <VTextField
                  v-model="searchQuery"
                  placeholder="Buscar..."
                  density="compact"
                />
              </div>
              <!-- 👉 Search button -->
              <VBtn prepend-icon="tabler-search" @click="searchUsers">
                Buscar
              </VBtn>
              <!-- 👉 Reset button -->
              <VBtn color="secondary" @click="reset"> Reiniciar </VBtn>
              <!-- 👉 Export button -->
              
              <VBtn               
                variant="tonal"
                color="success"
                prepend-icon="tabler-screen-share"
                @click="downloadFull"
                :loading="isFullLoading"
                :disabled="isFullLoading"
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
              <VBtn
                variant="tonal"
                color="success"
                prepend-icon="tabler-screen-share"
                @click="downloadSection"
              >
                Exportar sección
              </VBtn>

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
          <VTable class="text-no-wrap" :class="{ loaded: isLoading }">
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
              <tr
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
                      <span class="text-capitalize text-base">{{
                        user.provider
                      }}</span>
                    </div>
                  </div>
                </td>

                <!-- 👉 creacion -->
                <td>
                  <div class="d-flex align-center">
                    <div class="d-flex flex-column">
                      <span class="text-capitalize text-base">{{
                        user.created_at != '' ? moment(user.created_at).format('DD/MM/YYYY, HH:mm:ss') :  ''
                      }}</span>
                    </div>
                  </div>
                </td>

                <!-- 👉 ultimo sesion -->
                <td>
                  <div class="d-flex align-center">
                    <div class="d-flex flex-column">
                      <span class="text-capitalize text-base">{{
                        user.logged_at != '' ? moment(user.logged_at).format('DD/MM/YYYY, HH:mm:ss') :  ''
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
                <td>
                  <VChip
                    label
                    :color="resolveUserStatusVariant(user.newsletter_opt_in)"
                    size="small"
                    class="text-capitalize"
                  >
                    {{ user.newsletter_opt_in }}
                  </VChip>
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

                  <VBtn icon size="x-small" color="default" variant="text">
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
</style>
