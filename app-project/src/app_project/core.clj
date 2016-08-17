(ns app-project.core
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults api-defaults]]
            [app-project.handlers :as handlers]
            [app-project.middleware :as middleware]
            ;[ring.middleware.basic-authentication :refer [wrap-basic-authentication]]
            [ring.middleware.basic-authentication :as auth]
            [ring.middleware.logger :as logger]
            [ring.middleware.json :refer [wrap-json-body]]
            )
  )

(defroutes admin-api-routes
   (POST "/user" [] handlers/make-user)
   (DELETE "/user/:user-id" [] handlers/remove-user)
   (POST "/user/:user-id/password" [] handlers/update-password)
 )

(defroutes app-routes

           ;; REST API Routes
           (context "/api" []
                    (GET "/" [] handlers/default)
                    (context "/admin" []
                             (wrap-routes admin-api-routes middleware/admin-auth)
                             )

                    )

           ;; Route to serve a static index.html file
           (GET "/" [] handlers/serveIndex)

           ;; Default Routes
           (route/resources "/")
           (route/not-found "Not Found")

 )

;; Add in secure-defaults for SSL later.
(def app (-> app-routes
             (logger/wrap-with-logger)
             (wrap-json-body)
             (wrap-defaults api-defaults)
             )
  )

