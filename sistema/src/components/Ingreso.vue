<template>

    <v-layout align-start>
        <v-flex>
                  <v-toolbar flat color="white">
        <v-toolbar-title>Ingresos</v-toolbar-title>
        <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-text-field v-if="verNuevo===0" class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
         <v-btn v-if="verNuevo===0" @click="mostrarNuevo" color="primary" dark class="mb-2">Nuevo</v-btn>
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
        :items="ingresos"
        :search="search"
        class="elevation-1"
        v-if="verNuevo===0"
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
                <template v-if="props.item.estado == 'Aceptado'">
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
          <td>{{ props.item.usuario }}</td>
          <td>{{ props.item.proveedor }}</td>
          <td>{{ props.item.tipoComprobante }}</td>
          <td>{{ props.item.serieComprobante }}</td>
          <td>{{ props.item.numComprobante }}</td>
          <td>{{ props.item.fechaHora}}</td>
          <td>{{ props.item.impuesto}}</td>
          <td>{{ props.item.total}}</td>
          <td>
              <div v-if=" props.item.estado == 'Aceptado'">
                  <span class="blue--text">Aceptado</span>
              </div>
              <div v-else>
                   <span class="red--text">{{props.item.estado}}</span>
              </div>
          </td>
          
        </template>
        <template slot="no-data">
          <v-btn color="primary" @click="listar">Resetear</v-btn>
        </template>
      </v-data-table>
      <v-container grid-list-sm class="pa-4 white" style="padding-top:15px" v-if="verNuevo">
          <v-layout row wrap>
              <v-flex xs12 sm4 md4 lg4 x14>
                  <v-select v-model="tipoComprobante"
                    :items="comprobantes" label="Tipo Compobante">
                  </v-select>
              </v-flex>
              <v-flex xs12 sm4 md4 lg4 x14>
                  <v-text-field v-model="serieComprobante" label="Serie Comprobante"></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 md4 lg4 x14>
                  <v-text-field v-model="numComprobante" label="Número Comprobante"></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 md4 lg4 x14>
                  <v-select v-model="idProveedor"
                    :items="proveedores" label="Proveedor">
                  </v-select>
              </v-flex>
              <v-flex xs12 sm4 md4 lg4 x14>
                  <v-text-field type="number" 
                                v-model="serieComprobante" 
                                label="Impuesto">
                  </v-text-field>
              </v-flex>
              <v-flex xs12 sm8 md8 lg8 x18>
                  <v-text-field v-model="codigo" 
                                label="Código">
                  </v-text-field>
              </v-flex>
              <v-flex xs12 sm2 md2 lg2 x12>
                  <v-btn small fab dark color="teal">
                      <v-icon dark>list</v-icon>
                  </v-btn>
              </v-flex>
              <v-flex xs12 sm12 md12 lg12 x112>
                        <v-data-table
                        :headers="cabeceraDetalle"
                        :items="detalles"
                        hide-actions
                        class="elevation-1"
                    >
                        <template slot="items" slot-scope="props">
                            <td class="justify-center layout px-0">
                                <v-icon
                                small
                                class="mr-2"
                                >
                                delete
                                </v-icon>
                        </td>
                        <td>{{ props.item.articulo }}</td>
                        <td>{{ props.item.cantidad }}</td>
                        <td>{{ props.item.precio}}</td>
                        <td>{{ props.item.cantidad * props.item.precio }}</td>
                        
                        </template>
                        <template slot="no-data">
                            <h3>No hay articulos agregados al detalle</h3>
                        </template>
                    </v-data-table>
              </v-flex>

            <v-flex xs12 sm12 md12 lg12 x112>
                <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
            </v-flex>
            
            <v-flex xs12 sm12 md12 lg12 x112>
                <v-btn @click="ocultarNuevo" color="blue darken-1" flat>Cancelar</v-btn>
                <v-btn color="success">Guardar</v-btn>
            </v-flex>

          </v-layout>
      </v-container>
        </v-flex>
    </v-layout>
    
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            ingresos:[],
            dialog: false,
            headers: [
                { text: 'Opciones', value: 'opciones' },
                { text: 'Usuario', value: 'usuario', sortable: false  },
                { text: 'Proveedor', value: 'proveedor', sortable: false  },
                { text: 'Tipo de Compobante', value: 'tipoComprobante', sortable: true  },
                { text: 'Serie de Comprobante', value: 'serieComprobante', sortable: true },
                { text: 'Número Comprobante', value: 'numComprobante', sortable: true },
                { text: 'Fecha', value: 'fechaHora', sortable: false },
                { text: 'Impuesto', value: 'impuesto', sortable: false },
                { text: 'Total', value: 'total', sortable: false },
                { text: 'Estado', value: 'estado', sortable: false },
            ],
            cabeceraDetalle: [
                { text: 'Borrar', value: 'borrar', sortable: false },
                { text: 'Articulo', value: 'articulo', sortable: false  },
                { text: 'Cantidad', value: 'cantidad', sortable: false  },
                { text: 'Precio', value: 'precio', sortable: false  },
                { text: 'SubTotal', value: 'subtotal', sortable: false },

            ],
            detalles: [
                {idAticulo:'1000', articulo:'Articulo 1', cantidad:'5', precio:'10'},
                {idAticulo:'2000', articulo:'Articulo 2', cantidad:'5', precio:'20'},
            ],
            search: '',
            editedIndex: -1,
            id: '',
            idProveedor: '',
            proveedores: [],
            tipoComprobate: '',
            comprobantes: [
                'FACTURA', 'BOLETA', 'TICKET', 'GUIA'
            ],
            serieComprobante: '',
            numComprobante: '',
            impuesto: 18,
            codigo: '',
            verNuevo: 0,
            nombre: '',
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

        mostrarNuevo() {
            this.verNuevo = 1;
        },
        ocultarNuevo() {
            this.verNuevo = 0;
        },
        listar() {
            let me = this;
            let header={'Authorization': 'Bearer ' + this.$store.state.token};
            let configuracion = {headers: header};
            axios.get('api/Ingreso/Listar', configuracion)
            .then(function (resp) {
                me.ingresos = resp.data;
                console.log(resp);
            }).catch( function (error) {
                console.log(error);
            }) 
        }, 
        select() {
            let me = this;
            let proveedoresArray = [];
            let header={'Authorization': 'Bearer ' + this.$store.state.token};
            let configuracion = {headers: header};
            axios.get('api/Persona/SelectProveedor', configuracion)
            .then(function (resp) {
                proveedoresArray = resp.data;
                proveedoresArray.map(function(pro) {
                    me.proveedores.push({text: pro.nombre, value: pro.idPersona});
                });
                console.log(resp);
            }).catch( function (error) {
                console.log(error);
            }) 
        }, 
            editItem (item) {
                console.log(item);
                this.id = item.idUsuario;
                this.idRol = item.idRol,
                this.nombre = item.nombre;
                this.tipoDocumento = item.tipoDocumento;
                this.numDocumento = item.numDocumento;
                this.direccion = item.direccion;
                this.telefono = item.telefono;
                this.email = item.email;
                this.password = item.passwordHash;
                this.passwordAnt = item.passwordHash;
                this.stock = item.stock;
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
                this.passwordAnt = '';
                this.actPassword = false;
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

                let header={'Authorization': 'Bearer ' + this.$store.state.token};
                let configuracion = {headers: header};

                if (this.editedIndex > -1) {
                    // codigo para editar
                    
                    if ( me.password !== me.passwordAnt ) {
                        me.actPassword = true;
                    }

                    promesa = axios.put('api/Usuario/Actualizar', { 
                        'idUsuario': me.id,
                        'idRol': me.idRol,
                        'tipoDocumento': me.tipoDocumento,
                        'numDocumento': me.numDocumento,
                        'nombre': me.nombre,
                        'direccion': me.direccion,
                        'telefono': me.telefono,
                        'email': me.email,
                        'password': me.password,
                        'act_password': me.actPassword
                     }, configuracion);
                } else {
                    // codigo para guardar
                    promesa = axios.post('api/Usuario/Crear', { 
                        'idUsuario': '0',
                        'idRol': me.idRol,
                        'tipoDocumento': me.tipoDocumento,
                        'numDocumento': me.numDocumento,
                        'nombre': me.nombre,
                        'direccion': me.direccion,
                        'telefono': me.telefono,
                        'email': me.email,
                        'password': me.password
                     }, configuracion);
                    
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
                this.adId = item.idUsuario

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

                let header={'Authorization': 'Bearer ' + this.$store.state.token};
                let configuracion = {headers: header};

                axios
                .put('api/Usuario/Activar/'+this.adId, { }, configuracion)
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

                let header={'Authorization': 'Bearer ' + this.$store.state.token};
                let configuracion = {headers: header};

                axios
                .put('api/Usuario/Desactivar/'+this.adId, { }, configuracion)
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
