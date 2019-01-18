<template>
    <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6 lg5 x14>
            <v-card>
                <v-toolbar dark color="blue darken-3" >
                    <v-toolbar-title>
                        Acceso al sistema
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-text-field v-model="email" autofocus color="accent" label="Correo" required></v-text-field>
                    <v-text-field v-model="password" type="password" color="accent" label="Contraseña" required></v-text-field>
                </v-card-text>
                <v-card-actions class="px-3 pb-3">
                    <v-flex text-xs-rigth>
                        <v-btn color="primary">
                            Ingresar
                        </v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            password: ''
        }
    }
}
</script>

