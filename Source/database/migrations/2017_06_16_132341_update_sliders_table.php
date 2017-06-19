<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateSlidersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sliders', function (Blueprint $table) {
            $table->text('title')->nullable();
            $table->text('subtitle')->nullable();
            $table->string('img_src',250)->nullable();
            $table->string('thumbnail_src',250)->nullable();
            $table->string('video_id',250)->nullable();
            $table->integer('video_loop')->unsigned()->nullable();
            $table->integer('media_type_id')->unsigned();
            $table->foreign('media_type_id')->references('id')->on('media_type');
            $table->text('description')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('title');
            $table->dropColumn('subtitle');
            $table->dropColumn('img_src');
            $table->dropColumn('thumbnail_src');
            $table->dropColumn('video_id');
            $table->dropColumn('video_loop');
            $table->dropColumn('media_type_id');
            $table->string('description',50)->change();
        });
    }
}
