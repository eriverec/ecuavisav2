<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class Login extends Seeder
{

    public function run()
    {
        $this->db->table('institucion')->insert([
            'nombre'        => 'INSTITUCION'
        ]);

        $pass = password_hash("12345", PASSWORD_DEFAULT);
        $data = [
            'nickname'      => 'adminfacial',
            'nombre'        => 'ADMINISTRADOR',
            'idrol'         => '0',
            'idinstitucion' => '1',
            'estado'        => '1',
            'pass'          => $pass,
        ];
        // Using Query Builder
        $this->db->table('login')->insert($data);
    }
}
