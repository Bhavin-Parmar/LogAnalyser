import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LogServiceService {

  responseLinks=[];
  constructor(private http:HttpClient) { }

  getResponseLink(){
  // return this.http.get("https://es.stage.cnxloyalty.com/logs-2019-10-03/_search?q=app_name:ocl%20AND%20api:ocl_book%20AND%20verb:oclwcf_book_trip_folder");
  return this.http.post("https://es.stage.cnxloyalty.com/logs-*/_search",
  {
    "sort": [
      {
        "log_time": {
          "order": "desc",
          "unmapped_type": "boolean"
        }
      }
    ],
    "_source": {
      "excludes": []
    },
    "aggs": {
      "2": {
        "date_histogram": {
          "field": "log_time",
          "interval": "30m",
          "time_zone": "Asia/Kolkata",
          "min_doc_count": 1
        }
      }
    },
    "stored_fields": [
      "*"
    ],
    "script_fields": {},
    "docvalue_fields": [
      "check_in",
      "check_out",
      "dropoff_date",
      "log_time",
      "search_date",
      "time_stamp"
    ],
    "from" : 0, "size" : 100,
    "query": {
      "bool": {
        "must": [
          {
            "match_all": {}
          },
          {
            "match_phrase": {
              "app_name": {
                "query": "ocl"
              }
            }
          },
          {
            "match_phrase": {
              "api": {
                "query": "ocl_book"
              }
            }
          },
          {
            "match_phrase": {
              "status": {
                "query": "success"
              }
            }
          },
          {
            "match_phrase": {
              "verb": {
                "query": "oclwcf_book_trip_folder"
              }
            }
          }
          ,
          {
            "range": {
              "log_time": {
                "gte": 1569868200000,
                "lte": 1572546599999,
                "format": "epoch_millis"
              }
            }
          }
        ],
        "filter": [],
        "should": [],
        "must_not": []
      }
    }
  }
  )
  }
}
