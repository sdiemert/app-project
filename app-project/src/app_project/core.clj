(ns app-project.core
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults api-defaults]]
            [app-project.handlers :as handlers]
            [ring.middleware.basic-authentication :refer [wrap-basic-authentication]]
            [ring.middleware.logger :as logger]
            )
  )

(defroutes app-routes

           ;; REST API Routes
           (context "/api" []
                    (GET "/" [] handlers/default)
                    (GET "/doAction" [] handlers/doAction)
                    )

           ;; Route to serve a static index.html file
           (GET "/" [] handlers/serveIndex)

           ;; Default Routes
           (route/resources "/")
           (route/not-found "Not Found")

 )

(defn authenticated? [name pass]
  (and (= name "foo")
       (= pass "bar")))

(defn custom-middleware [handler]
    (fn [req]
      (handler req)
      )
  )

;; Add in secure-defaults for SSL later.
(def app (-> app-routes
             (custom-middleware)
             (logger/wrap-with-logger)
             (wrap-basic-authentication authenticated?)
             (wrap-defaults site-defaults)
             (wrap-defaults api-defaults)
             )
  )

