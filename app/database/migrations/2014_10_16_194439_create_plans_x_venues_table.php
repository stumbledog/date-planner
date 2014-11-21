<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlansxvenuesTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('courses_x_venues', function($table){
            $table->integer('courses_id')->unsigned();
            $table->integer('venues_id')->unsigned();
            $table->integer('order');
            $table->foreign('courses_id')->references('id')->on('courses');
            $table->foreign('venues_id')->references('id')->on('venues');
            $table->primary(array('courses_id','venues_id'));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::drop('courses_x_venues');
    }

}
