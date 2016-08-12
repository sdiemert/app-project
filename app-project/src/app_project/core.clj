(ns app-project.core
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]))

(defn foobar [req]
  (str "foobar")
  )


(defroutes app-routes
           (GET "/" [] foobar)
           (route/not-found "Not Found"))

(def app
  (wrap-defaults app-routes site-defaults))

