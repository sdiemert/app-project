(ns app-project.db-rules
  (:require [grape.core :refer :all]))

(def GTSystem nil)

(defn initalizeGTS
  ([] (initalizeGTS 'app))
  ([sysName] (def GTSystem (gts (symbol sysName) {}))

   (def GTSystem
     (rule 'is-role? ['user 'role]
           {:read (pattern
                    (node 'n1 {:asserts {:kind "'user'":name "'&user'" :role "'&role'"}})
                    )
            }
           GTSystem
           )
     )

   (def GTSystem
     (rule 'make-user! ['user 'role]
           {:create (pattern
                      (node 'n1 {:asserts {:kind "'user'":name "'&user'" :role "'&role'"}})
                      (node 'n3 {:asserts {:kind "'consent'" :value "'null'"}})
                      (edge 'e2 {:src 'n1 :tar 'n3 :label "consent"})
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

   (def GTSystem
     (rule 'delete-user! ['user]
           {:read (pattern
                      (node 'n1 {:asserts {:kind "'user'" :name "'&user'"}})
                    )
            :delete ['n1]
            }
           GTSystem)
     )

   (def GTSystem
     (rule 'update-consent! ['user 'consent 'ts]
           {:read (pattern
                    (node 'n1 {:asserts {:kind "'user'" :name "'&user'"}})
                    (node 'n2 {:asserts {:kind "'consent'"}})
                    (edge 'e1 {:src 'n1 :tar 'n2 :label "consent"})
                    )
            :create  (pattern
                       (node 'n3 {:asserts {:kind "'consent'" :value "'&consent'" :time "'&ts'"}})
                       (edge 'e2 {:src 'n1 :tar 'n3 :label "consent"})
                       )
            :delete ['e1 'n2]
            }
           GTSystem)
     )

   (def GTSystem
     (rule 'exit-study! ['user 'status 'ts]
           {:read (pattern
                    (node 'n1 {:asserts {:kind "'user'" :name "'&user'"}})
                    )
            :create  (pattern
                       (node 'n2 {:asserts {:kind "'exit'" :value "'&status'" :time "'&ts'"}})
                       (edge 'e1 {:src 'n1 :tar 'n2 :label "exit"})
                       )
            }
           GTSystem)
     )

   (def GTSystem
     (rule 'done-study! ['user 'ts]
           {:read (pattern
                    (node 'n1 {:asserts {:kind "'user'" :name "'&user'"}})
                    )
            :create  (pattern
                       (node 'n2 {:asserts {:kind "'done'" :value "'user completed the study'" :time "'&ts'"}})
                       (edge 'e1 {:src 'n1 :tar 'n2 :label "done"})
                       )
            }
           GTSystem)
     )

   (def GTSystem
     (rule 'already-answered? ['user 'qid]
           {:read (pattern
                    (node 'n1 {:asserts {:kind "'user'" :name "'&user'"}})
                    (node 'n2 {:asserts {:kind "'response'"  :type "'timeline'" :questionNumber "'&qid'"}})
                    (edge 'e1 {:src 'n1 :tar 'n2 :label "response"})
                    )
            }
           GTSystem)
     )

   (def GTSystem
     (rule 'already-answered-survey? ['user 'qid]
           {:read (pattern
                    (node 'n1 {:asserts {:kind "'user'" :name "'&user'"}})
                    (node 'n2 {:asserts {:kind "'response'" :type "'survey'" :questionNumber "'&qid'"}})
                    (edge 'e1 {:src 'n1 :tar 'n2 :label "response"})
                    )
            }
           GTSystem)
     )

   (def GTSystem
     (rule 'record-timeline-response! ['user 'qid 'lower 'upper 'ts]
           {:read (pattern
                    (node 'n1 {:asserts {:kind "'user'" :name "'&user'"}})
                    )
            :create  (pattern
                       (node 'n2 {:asserts
                                  {:kind "'response'"
                                   :type "'timeline'"
                                   :questionNumber "'&qid'"
                                   :lower "'&lower'"
                                   :upper "'&upper'"
                                   :time "'&ts'"
                                   }
                                }
                             )
                       (edge 'e1 {:src 'n1 :tar 'n2 :label "response"})
                       )
            }
           GTSystem)
     )

   (def GTSystem
     (rule 'record-survey-response! ['user 'qid 'ts 'ans 'oth]
           {:read   (pattern
                      (node 'n1 {:asserts {:kind "'user'" :name "'&user'"}})
                      )
            :create (pattern
                      (node 'n2 {:asserts
                                 {:kind           "'response'"
                                  :type           "'survey'"
                                  :questionNumber "'&qid'"
                                  :answer         "'&ans'"
                                  :additional     "'&oth'"
                                  :time           "'&ts'"
                                  }
                                 }
                            )
                      (edge 'e1 {:src 'n1 :tar 'n2 :label "response"})
                      )
            }
           GTSystem)
     )

     (def GTSystem
       (rule 'draw-email ['em 'ts]
             {:create  (pattern
                         (node 'n2 {:asserts
                                    {:kind "'email'"
                                     :value "'&em'"
                                     :time "'&ts'"
                                     }
                                    }
                               )
                         )
              }
             GTSystem)
     )
  )
)