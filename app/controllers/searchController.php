<?php

class PlanController extends BaseController {

    public function getPlan() {
        return View::make('hello');
    }

    public function setPlan() {
        
    }

    public function make() {
        return View::make('planner.planner')->with('title', 'Date Coach');
    }
}
