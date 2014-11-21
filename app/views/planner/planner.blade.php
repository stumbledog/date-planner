@extends('layouts.default')

@section('head')
{{ HTML::style(asset('/assets/plugins/bootstrap/css/bootstrap.min.css')) }}
{{ HTML::style(asset('/assets/css/style.css')) }}

{{ HTML::style(asset('/assets/plugins/line-icons/line-icons.css')) }}
{{ HTML::style(asset('/assets/plugins/font-awesome/css/font-awesome.min.css')) }}
{{ HTML::style(asset('/assets/css/plugins/brand-buttons/brand-buttons.css')) }}
{{ HTML::style(asset('/assets/plugins/sky-forms/version-2.0.1/css/custom-sky-forms.css')) }}

{{ HTML::style(asset('/assets/css/pages/feature_timeline2.css')) }}

{{ HTML::style(asset('/assets/css/pages/page_search_inner.css')) }}
{{ HTML::style(asset('/assets/css/pages/blog_magazine.css')) }}
{{ HTML::style(asset('/assets/css/themes/default.css')) }}
{{ HTML::style(asset('/assets/css/custom.css')) }}

{{ HTML::style(asset('/assets/css/leaflet.awesome-markers.css')) }}

{{ HTML::style('http://cdn.leafletjs.com/leaflet-0.7/leaflet.css') }}
{{ HTML::style('//code.jquery.com/ui/1.11.1/themes/smoothness/jquery-ui.css') }}

{{ HTML::script('//code.jquery.com/jquery-1.11.0.min.js') }}
{{ HTML::script('//code.jquery.com/ui/1.11.1/jquery-ui.js') }}

{{ HTML::script('https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places') }}
{{ HTML::script('//cdn.leafletjs.com/leaflet-0.7/leaflet-src.js') }}

{{ HTML::script(asset('/lib/OSMBuildings-Leaflet.js')) }}
{{ HTML::script(asset('/lib/leaflet.awesome-markers.min.js')) }}
{{ HTML::script(asset('/js/Planner.js')) }}
{{ HTML::script(asset('/js/Map.js')) }}


<style>
    html, body, #map{
        height:100%;
    }
</style>
@stop

@section('body')
<!--
<div id="yelp-search-form">
    {{ Form::open(array('route'=>'yelp-search-businesses', 'post' => 'post', 'id' => 'search-businesses')) }}
    {{ Form::close() }}
</div>-->
<div id="map"></div>
<script>
    new Map("map");
</script>
@stop