<template>

    <v-layout align-start>
        <v-flex>
                  <v-toolbar flat color="white">
        <v-toolbar-title>Usuarios</v-toolbar-title>
        <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <v-btn slot="activator" color="primary" dark class="mb-2">Nuevo</v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
  
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-select v-model="idRol" :items="roles" lable="Rol"></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-select v-model="tipoDocumento" :items="documentos" lable="Tipo Documento"></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="numDocumento" label="Numero Documento"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="direccion" label="Dirección"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="telefono" label="Telefono"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="email" label="Correo"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field type="password" v-model="password" label="Contraseña"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12 v-show="valida">
                   <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">

                   </div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
  
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" flat @click="guardar">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="adModal" max-width="400px">
            <v-card>
                <v-card-title class="headline" v-if="adAccion==1">¿Activar Usuario?</v-card-title>
                <v-card-title class="headline" v-if="adAccion==2">Desactivar Usuario?</v-card-title>
                <v-card-text>
                    Estás a punto de 
                    <span v-if="adAccion==1">Activar</span>
                    <span v-if="adAccion==2">Desactivar</span>
                    el usuario {{ adNombre }}
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat="flat" @click="activarDesactivarCerrar">
                        Cancelar
                    </v-btn>
                    <v-btn v-if="adAccion==1" color="orange darken-4" flat="flat" @click="activar">
                        Activar
                    </v-btn>
                    <v-btn v-if="adAccion==2" color="orange darken-4" flat="flat" @click="desactivar">
                        Desactivar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="usuarios"
        :search="search"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
            <td class="justify-center layout px-0">
                <v-icon
                small
                class="mr-2"
                @click="editItem(props.item)"
                >
                edit
                </v-icon>
                <template v-if="props.item.condicion">
                    <v-icon
                        small
                        @click="activarDesactivarMostrar(2, props.item)">
                        block
                    </v-icon>
                </template>
                <template v-else>
                    <v-icon
                        small
                        @click="activarDesactivarMostrar(1, props.item)">
                        check
                    </v-icon>
                </template>
                
          </td>
          <td>{{ props.item.nombre }}</td>
          <td>{{ props.item.rol }}</td>
          <td>{{ props.item.tipoDocumento }}</td>
          <td>{{ props.item.numDocumento }}</td>
          <td>{{ props.item.direccion }}</td>
          <td>{{ props.item.telefono}}</td>
          <td>{{ props.item.email}}</td>
          <td>
              <div v-if=" props.item.condicion">
                  <span class="blue--text">Activo</span>
              </div>
              <div v-else>
                   <span class="red--text">Inactivo</span>
              </div>
          </td>
          
        </template>
        <template slot="no-data">
          <v-btn color="primary" @click="listar">Resetear</v-btn>
        </template>
      </v-data-table>
        </v-flex>
    </v-layout>
    
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            usuarios:[],
            dialog: false,
            headers: [
                { text: 'Opciones', value: 'opciones', sortable: false },
                { text: 'Nombre', value: 'Nombre' },
                { text: 'Rol', value: 'Rol' },
                { text: 'Tipo Documento', value: 'tipoDocumento' },
                { text: 'Numero Documento', value: 'numDocumento', sortable: false },
                { text: 'Dirección', value: 'direccion', sortable: false },
                { text: 'Telefono', value: 'telefono', sortable: false },
                { text: 'Correo', value: 'email', sortable: false },
                { text: 'Estado', value: 'condicion', sortable: false },
            ],
            search: '',
            editedIndex: -1,
            id: '',
            idRol: '',
            roles: [],
            tipoDocumento: '',
            documentos: [
                'IFE', 'CEDULA', 'CARTILLA', 'PASAPORTE'
            ],
            numDocumento: '',
            direccion: '',
            telefono: '',
            email: '',
            password: '',
            nombre: '',
            actPassword: false,
            valida: 0,
            validaMensaje: [],
            adModal: 0,
            adAccion: 0,
            adNombre: '',
            adId: '',
        }
    },
        computed: {
        formTitle () {
        return this.editedIndex === -1 ? 'Nueva Usuario' : 'Actualizando Usuario'
        }
    },

    watch: {
        dialog (val) {
        val || this.close()
        }
    },

    created () {
        this.listar();
        this.select();
    },
    methods: {
        /* eslint-disable */
        listar() {
            let me = this;
            axios.get('api/Usuario/Listar')
            .then(function (resp) {
                me.usuarios = resp.data;
                console.log(resp);
            }).catch( function (error) {
                console.log(error);
            }) 
        }, 
        select() {
            let me = this;
            let rolArray = [];
            axios.get('api/Rol/Select')
            .then(function (resp) {
                rolArray = resp.data;
                rolArray.map(function(cat) {
                    me.roles.push({text: cat.nombre, value: cat.idRol});
                });
                console.log(resp);
            }).catch( function (error) {
                console.log(error);
            }) 
        }, 
            editItem (item) {
                this.id = item.idArticulo;
                this.idCategoria = item.idCategoria,
                this.codigo = item.codigo,
                this.nombre = item.nombre;
                this.stock = item.stock;
                this.precioVenta = item.precioVenta;
                this.descripcion = item.descripcion;
                this.editedIndex = 1;
                this.dialog = true
            },

            deleteItem (item) {
                const index = this.desserts.indexOf(item)
                confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
            },

            close () {
                this.dialog = false;
                this.limpiar();
            },

            limpiar() {
                this.id = '';
                this.idRol = '';
                this.tipoDocumento = '';
                this.numDocumento = '';
                this.nombre = '';
                this.direccion = '';
                this.telefono = '';
                this.email = '';
                this.password = '';
                this.deleteItem =  '';
                this.valida = 0;
                this.editedIndex = -1;
            },

            guardar () {

                if( this.validar() === 1 ) {
                    return;
                }

                let promesa = {};
                let me = this;

                if (this.editedIndex > -1) {
                    // codigo para editar
                    
                    promesa = axios.put('api/Usuario/Actualizar', { 
                        'idArticulo': me.id,
                        'idCategoria': me.idCategoria,
                        'codigo': me.codigo,
                        'nombre': me.nombre,
                        'stock': me.stock,
                        'precioVenta': me.precioVenta,
                        'descripcion': me.descripcion
                     });
                } else {
                    // codigo para guardar
                    promesa = axios.post('api/Usuario/Crear', { 
                        'idArticulo': '0',
                        'idRol': me.idRol,
                        'tipoDocumento': me.tipoDocumento,
                        'numDocumento': me.numDocumento,
                        'nombre': me.nombre,
                        'direccion': me.direccion,
                        'telefono': me.telefono,
                        'email': me.email,
                        'password': me.password
                     });
                    
                }

                promesa
                .then(function (response) {
                    // eslint-disable-next-line
                        console.log("response", response);
                        me.close();
                        me.listar();
                })
                // eslint-disable-next-line
                .catch(function (error) {
                    // eslint-disable-next-line
                    console.log(error);
                });
            },
            validar() {

                this.valida = 0;
                this.validaMensaje = [];
                if( this.nombre.length < 3 || this.nombre.length > 100 ) {
                    this.validaMensaje.push('El nombre debe tener mas de 3 caracteres y menos de 100 caracteres.');
                }

                if( !this.idRol ) {
                    this.validaMensaje.push('Seleccione una rol.');
                }

                if( !this.tipoDocumento ) {
                    this.validaMensaje.push('Seleccione una tipo de documento.');
                }

                if( !this.email ) {
                    this.validaMensaje.push('Ingrese el correo del usuario.');
                }


                if( !this.password ) {
                    this.validaMensaje.push('Ingrese el stock la contraeña del usuario.');
                }

                
                if( this.validaMensaje.length ) {
                    this.valida = 1;
                }

                return this.valida;
            },
            activarDesactivarMostrar( accion, item ) {

                this.adModal = 1;
                this.adNombre = item.nombre;
                this.adId = item.idArticulo

                if ( accion === 1 ) {
                    this.adAccion = 1;
                } else if ( accion === 2 ) {
                    this.adAccion = 2;
                } else  {
                    this.adModal = 0;
                }
            },
            activar () {
                let me = this;
                axios
                .put('api/Articulo/Activar/'+this.adId, { })
                     .then(function (response) {
                    // eslint-disable-next-line
                        console.log("response", response);
                        me.adModal = 0;
                        me.adAccion = 0;
                        me.adNombre = '';
                        me.adId = '';
                        me.listar();
                    })
                    // eslint-disable-next-line
                    .catch(function (error) {
                        // eslint-disable-next-line
                        console.log(error);
                    });
            },
            desactivar() {
                let me = this;
                axios
                .put('api/Articulo/Desactivar/'+this.adId, { })
                     .then(function (response) {
                    // eslint-disable-next-line
                        console.log("response", response);
                        me.adModal = 0;
                        me.adAccion = 0;
                        me.adNombre = '';
                        me.adId = '';
                        me.listar();
                    })
                    // eslint-disable-next-line
                    .catch(function (error) {
                        // eslint-disable-next-line
                        console.log(error);
                    });
            },
            activarDesactivarCerrar() {
                this.adModal = 0;
            }
    }
}
</script>
