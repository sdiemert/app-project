 (ns app-project.db
   (:require [app-project.db-rules :as rules]
             [grape.core :as grape]
             ))

(defn connect [] (rules/initalizeGTS 'app))

(defn doAction []
  (grape/attempt rules/GTSystem (grape/apl 'doAction!))
  )

(defn auth [user pass]
  (grape/attempt rules/GTSystem (grape/apl 'authenticate? user pass))
  )

(defn make-user [user pass]
  (if (not (grape/attempt rules/GTSystem (grape/apl 'user-exists? user)))
       (grape/attempt rules/GTSystem (grape/apl 'make-user! user pass))
       false
    )
  )

(defn delete-user [user]
  (grape/attempt rules/GTSystem (grape/apl 'delete-user! user))
  )

(defn update-password [user newP oldP]
  (grape/attempt rules/GTSystem (grape/apl 'update-password! user oldP newP))
  )