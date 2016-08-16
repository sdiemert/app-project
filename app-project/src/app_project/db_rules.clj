(ns app-project.db-rules
  (:require [grape.core :refer :all]))

(def GTSystem nil)

(defn initalizeGTS
  ([] (initalizeGTS 'app))
  ([sysName] (def GTSystem (gts (symbol sysName) {}))

   (def GTSystem
     (rule 'doAction! []
           {:create (pattern (node 'n1 {:label "AppNode"}))}
           GTSystem
           )
     )

   (def GTSystem
     (rule 'authenticate? ['user 'pass]
           {:read (pattern
                    (node 'n1 {:asserts {:kind "'user'":name "'&user'"}})
                    (node 'n2 {:asserts {:kind "'password'" :pass"'&pass'"}})
                    (edge 'e1 {:src 'n1 :tar 'n2 :label "password"})
                    )
            }
           GTSystem
           )
     )

   (def GTSystem
     (rule 'make-user! ['user 'pass]
           {:read (pattern
                    (node 'rootNode {:asserts {:kind "'root'"}})
                    )

            :create (pattern
                      (node 'n1 {:asserts {:kind "'user'":name "'&user'"}})
                      (node 'n2 {:asserts {:kind "'password'" :pass"'&pass'"}})
                      (edge 'e1 {:src 'n1 :tar 'n2 :label "password"})
                    )
            }
           GTSystem
           )
     )

   (def GTSystem
     (rule 'user-exists? ['user]
           {:read (pattern
                    (node 'n1 {:asserts {:kind "'user'" :name "'&user'"}})
                    )
            }
           GTSystem
           )

     )
  )
)