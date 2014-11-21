<?php

include(app_path() . '/lib/OAuth.php');

class YelpController extends BaseController {

    private $CONSUMER_KEY = "Kznt3Oyxl6JnlYyTetwiRA";
    private $CONSUMER_SECRET = "HU_qjA_zZ0Lh0q6CwMtu34Mmpwo";
    private $TOKEN = "O_SyFID3MVo4SK7TzVGbkwsDoPeQIEI4";
    private $TOKEN_SECRET = "I4pk7H1CjDHCmsl-4FwInzT4kds";
    private $API_HOST = 'api.yelp.com';

    public function searchLocalBusinesses() {
        $data = Input::all();
        if (Request::ajax()) {
            $opt = $this->getOption($data);
            return $this->getSearchResult($opt);
        } else {
            return $data;
        }
    }

    public function getBusinessDetail() {
        $data = Input::all();
        if (Request::ajax()) {
            return $this->getBusiness($data['id']);
        } else {
            return $data;
        }
    }

    private function getOption($data) {
        $opt = array(
            //"term" => $data['term'],
            "latitude" => $data['lat'],
            "longitude" => $data['lng'],
            "radius" => $data['radius']
        );
        return $opt;
    }

    private function getBusiness($id) {
        $business_path = "/v2/business/" . $id;
        return $this->request($this->API_HOST, $business_path);
    }

    private function getSearchResult($opt) {
        $url_params = array();
        //$url_params['term'] = $opt["term"];
        $url_params["ll"] = $opt["latitude"] . "," . $opt["longitude"];
        $url_params["radius_filter"] = $opt["radius"];
        $search_path = "/v2/search/?" . http_build_query($url_params);
        return $this->request($this->API_HOST, $search_path);
    }

    private function request($host, $path) {
        $unsigned_url = "http://" . $host . $path;
        $token = new OAuthToken($this->TOKEN, $this->TOKEN_SECRET);
        $consumer = new OAuthConsumer($this->CONSUMER_KEY, $this->CONSUMER_SECRET);
        $signature_method = new OAuthSignatureMethod_HMAC_SHA1();
        $oauthrequest = OAuthRequest::from_consumer_and_token(
                        $consumer, $token, 'GET', $unsigned_url
        );
        $oauthrequest->sign_request($signature_method, $consumer, $token);
        $signed_url = $oauthrequest->to_url();
        $ch = curl_init($signed_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $data = curl_exec($ch);
        curl_close($ch);
        return $data;
    }

}
