<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVenuesTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('venues', function($table) {
            $table->increments('id');
            $table->float('lat');
            $table->float('lng');
            $table->string('type_id');
            $table->string('type', 1);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::drop('venues');
    }

}
