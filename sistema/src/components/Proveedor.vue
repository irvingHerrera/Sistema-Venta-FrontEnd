<template>

    <v-layout align-start>
        <v-flex>
                  <v-toolbar flat color="white">
        <v-toolbar-title>Proveedores</v-toolbar-title>
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
                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-select v-model="tipoDocumento" :items="documentos" lable="Tipo Documento"></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="numDocumento" label="Numero Documento"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="direccion" label="Dirección"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="telefono" label="Telefono"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="email" label="Correo"></v-text-field>
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
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="proveedores"
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
                
          </td>
          <td>{{ props.item.nombre }}</td>
          <td>{{ props.item.tipoPersona }}</td>
          <td>{{ props.item.tipoDocumento }}</td>
          <td>{{ props.item.numDocumento }}</td>
          <td>{{ props.item.direccion }}</td>
          <td>{{ props.item.telefono}}</td>
          <td>{{ props.item.email}}</td>
          
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
            proveedores:[],
            dialog: false,
            headers: [
                { text: 'Opciones', value: 'opciones', sortable: false },
                { text: 'Nombre', value: 'Nombre' },
                { text: 'Tipo Persona', value: 'tipoPersona' },
                { text: 'Tipo Documento', value: 'tipoDocumento' },
                { text: 'Numero Documento', value: 'numDocumento', sortable: false },
                { text: 'Dirección', value: 'direccion', sortable: false },
                { text: 'Telefono', value: 'telefono', sortable: false },
                { text: 'Correo', value: 'email', sortable: false },
            ],
            search: '',
            editedIndex: -1,
            id: '',
            tipoDocumento: '',
            documentos: [
                'INE', 'CEDULA', 'CARTILLA', 'PASAPORTE'
            ],
            numDocumento: '',
            direccion: '',
            telefono: '',
            email: '',
            password: '',
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
        return this.editedIndex === -1 ? 'Nueva Proveedor' : 'Actualizando Proveedor'
        }
    },

    watch: {
        dialog (val) {
        val || this.close()
        }
    },

    created () {
        this.listar();
    },
    methods: {
        /* eslint-disable */
        listar() {
            let me = this;
            let header={'Authorization': 'Bearer ' + this.$store.state.token};
            let configuracion = {headers: header};
            axios.get('api/Persona/ListarProvedor', configuracion)
            .then(function (resp) {
                me.proveedores = resp.data;
                console.log(resp);
            }).catch( function (error) {
                console.log(error);
            }) 
        }, 
            editItem (item) {
                console.log(item);
                this.id = item.idPersona;
                this.nombre = item.nombre;
                this.tipoDocumento = item.tipoDocumento;
                this.numDocumento = item.numDocumento;
                this.direccion = item.direccion;
                this.telefono = item.telefono;
                this.email = item.email;
                this.editedIndex = 1;
                this.dialog = true
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

                    promesa = axios.put('api/Persona/Actualizar', { 
                        'idPersona': me.id,
                        'tipoPersona': 'proveedor',
                        'tipoDocumento': me.tipoDocumento,
                        'numDocumento': me.numDocumento,
                        'nombre': me.nombre,
                        'direccion': me.direccion,
                        'telefono': me.telefono,
                        'email': me.email,
                     }, configuracion);
                } else {
                    // codigo para guardar
                    promesa = axios.post('api/Persona/Crear', { 
                        'idPersona': '0',
                        'tipoPersona': 'proveedor',
                        'tipoDocumento': me.tipoDocumento,
                        'numDocumento': me.numDocumento,
                        'nombre': me.nombre,
                        'direccion': me.direccion,
                        'telefono': me.telefono,
                        'email': me.email,
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

                if( !this.tipoDocumento ) {
                    this.validaMensaje.push('Seleccione una tipo de documento.');
                }

                if( this.validaMensaje.length ) {
                    this.valida = 1;
                }

                return this.valida;
            }
    }
}
</script>
