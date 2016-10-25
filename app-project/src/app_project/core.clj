(ns app-project.core
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults api-defaults]]
            [app-project.handlers :as handlers]
            [ring.middleware.logger :as logger]
            [ring.middleware.json :refer [wrap-json-body wrap-json-response]]
            )
  )

(defroutes user-routes
           (GET "/" [] handlers/default)
           (GET "/key" [] handlers/get-key)
           (POST "/:uuid/consent" [] handlers/consent)
           (POST "/:uuid/exit"     [] handlers/exit-study)
           (POST "/:uuid/done"     [] handlers/done-study)
           (POST "/:uuid/survey/:qid" [] handlers/survey-response)
           (POST "/:uuid/question/:qid" [] handlers/question-response)
           (GET  "/:uuid/timeline/:id" [] handlers/get-timeline)
           )

(defroutes public-routes

           ;; Route to serve a static index.html file
           (GET "/" [] handlers/serveIndex)

           ;; Default Routes
           (route/resources "/")
           (route/not-found "Not Found")
           )

(def app (-> (routes
               (context "/api" [] user-routes)
               public-routes ; routes accessible to the public.
               )
             (logger/wrap-with-logger)
             (wrap-json-body)
             (wrap-json-response)
             (wrap-defaults api-defaults)
             )
          )