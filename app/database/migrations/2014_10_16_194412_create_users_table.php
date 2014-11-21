<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('users', function($table) {
            $table->increments('id');
            $table->string('email', 50);
            $table->string('username', 20);
            $table->string('password', 60);
            $table->string('password_temp', 60);
            $table->string('remember_token', 100);
            $table->string('code', 60);
            $table->integer('active');
            $table->timestamps();
        });

        DB::table('users')->insert(array(
            'email' => 'stumbledog@gmail.com',
            'username' => 'Sunggu Lee',
            'password' => '$2y$10$E/bkIUguQhNlORTek3ytbOfJZvUjM.Fs9WDxQjXEz6Z.cqpsRkK/u',
            'active' => 1
        ));
    }

    public function down() {
        Schema::drop('users');
    }

}
