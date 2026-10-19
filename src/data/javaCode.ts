export const JAVA_SWITCH_CASE_CODE = `/**
 * Patika.dev Java101 - ATM Projesi (Ödev Çözümü)
 * Konu: Döngüler (while, do-while) ve Switch-Case Karar Yapısı
 * 
 * @author Enes Öztürk
 * @version 1.0
 */

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        String userName, password;
        Scanner input = new Scanner(System.in);
        int right = 3;
        int balance = 1500;
        int select;

        while (right > 0) {
            System.out.print("Kullanıcı Adınız : ");
            userName = input.nextLine();
            System.out.print("Parolanız : ");
            password = input.nextLine();

            // Kullanıcı adı ve şifre kontrolü
            if (userName.equals("patika") && password.equals("dev123")) {
                System.out.println("Merhaba, Kodluyoruz Bankasına Hoşgeldiniz!");
                
                // Kullanıcı 4 (Çıkış) seçeneğini seçene kadar menüyü göster
                do {
                    System.out.println("1-Para yatırma\\n" +
                            "2-Para Çekme\\n" +
                            "3-Bakiye Sorgula\\n" +
                            "4-Çıkış Yap");
                    System.out.print("Lütfen yapmak istediğiniz işlemi seçiniz : ");
                    select = input.nextInt();

                    // ÖDEV: ATM işlemlerini if-else yerine Switch-Case ile gerçekleştiriyoruz
                    switch (select) {
                        case 1:
                            System.out.print("Para miktarı : ");
                            int depositAmount = input.nextInt();
                            balance += depositAmount;
                            System.out.println("Para yatırma başarılı. Güncel Bakiyeniz: " + balance + " TL");
                            break;

                        case 2:
                            System.out.print("Para miktarı : ");
                            int withdrawAmount = input.nextInt();
                            if (withdrawAmount > balance) {
                                System.out.println("Bakiye yetersiz.");
                            } else {
                                balance -= withdrawAmount;
                                System.out.println("Lütfen paranızı alınız. Güncel Bakiyeniz: " + balance + " TL");
                            }
                            break;

                        case 3:
                            System.out.println("Bakiyeniz : " + balance + " TL");
                            break;

                        case 4:
                            System.out.println("Tekrar görüşmek üzere.");
                            break;

                        default:
                            System.out.println("Geçersiz bir işlem seçtiniz! Lütfen 1-4 arasında bir seçim yapınız.");
                            break;
                    }

                } while (select != 4);
                
                // Başarılı giriş ve işlemler tamamlandığında dıştaki while döngüsünden çık
                break;

            } else {
                right--;
                System.out.println("Hatalı kullanıcı adı veya şifre. Tekrar deneyiniz.");
                if (right == 0) {
                    System.out.println("Hesabınız bloke olmuştur lütfen banka ile iletişime geçiniz.");
                } else {
                    System.out.println("Kalan Hakkınız : " + right);
                }
            }
        }

        input.close();
    }
}
// Hazırlayan: Enes Öztürk
`;

export const JAVA_ORIGINAL_CODE = `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        String userName, password;
        Scanner input = new Scanner(System.in);
        int right = 3;
        int balance = 1500;
        int select;
        while (right > 0) {
            System.out.print("Kullanıcı Adınız :");
            userName = input.nextLine();
            System.out.print("Parolanız : ");
            password = input.nextLine();

            if (userName.equals("patika") && password.equals("dev123")) {
                System.out.println("Merhaba, Kodluyoruz Bankasına Hoşgeldiniz!");
                do {
                    System.out.println("1-Para yatırma\\n" +
                            "2-Para Çekme\\n" +
                            "3-Bakiye Sorgula\\n" +
                            "4-Çıkış Yap");
                    System.out.print("Lütfen yapmak istediğiniz işlemi seçiniz : ");
                    select = input.nextInt();
                    if (select == 1) {
                        System.out.print("Para miktarı : ");
                        int price = input.nextInt();
                        balance += price;
                    } else if (select == 2) {
                        System.out.print("Para miktarı : ");
                        int price = input.nextInt();
                        if (price > balance) {
                            System.out.println("Bakiye yetersiz.");
                        } else {
                            balance -= price;
                        }
                    } else if (select == 3) {
                        System.out.println("Bakiyeniz : " + balance);
                    }
                } while (select != 4);
                System.out.println("Tekrar görüşmek üzere.");
                break;
            } else {
                right--;
                System.out.println("Hatalı kullanıcı adı veya şifre. Tekrar deneyiniz.");
                if (right == 0) {
                    System.out.println("Hesabınız bloke olmuştur lütfen banka ile iletişime geçiniz.");
                } else {
                    System.out.println("Kalan Hakkınız : " + right);
                }
            }
        }
    }
}`;

export const HOMEWORK_DETAILS = {
  studentName: "Enes Öztürk",
  course: "Java 101 / Patika.dev & Kodluyoruz",
  topic: "Döngüler & Switch-Case ile Banka ATM Projesi",
  date: "Ekim 2026",
  summary:
    "Bu projede, kullanıcının sisteme 3 deneme hakkı ile giriş yapmasını sağlayan bir `while` döngüsü ve menü işlemlerini kullanıcı çıkış yapana kadar tekrarlayan bir `do-while` döngüsü kullanılmıştır. Ödev kapsamında if-else merdiveni yerine daha okunaklı ve performanslı olan Java `switch-case` yapısına dönüştürülmüştür.",
  differences: [
    {
      title: "1. Çoklu Koşul Kontrolü (Switch-Case vs If-Else)",
      description:
        "Orijinal kodda `if (select == 1) ... else if (select == 2) ... else if (select == 3)` merdiveni kullanılıyordu. Switch-case yapısı, sabit bir değişkenin (`select`) belirli tam sayı değerlerini karşılaştırırken çok daha temiz, okunabilir ve Java sanal makinesi (JVM) tarafından 'tableswitch' / 'lookupswitch' byte kodlarıyla optimize edilebilir bir yapı sunar.",
    },
    {
      title: "2. `break;` İfadesinin Kritik Önemi",
      description:
        "Switch-case bloklarında her bir case'in sonuna `break;` konulması zorunludur. Eğer break unutulursa 'fall-through' (aşağıya kayma) durumu oluşur ve bir sonraki case kontrol edilmeksizin çalıştırılır.",
    },
    {
      title: "3. `default:` Durumu (Hatalı Giriş Yakalama)",
      description:
        "Orijinal if-else kodunda kullanıcı 1, 2, 3 veya 4 dışında bir sayı girdiğinde (örneğin 9) sessizce do-while başa dönüyordu. Switch-case bloğuna eklenen `default:` alanı sayesinde geçersiz menü girişleri kullanıcıya anında bildirilmektedir.",
    },
    {
      title: "4. Döngü Birlikteliği (While & Do-While)",
      description:
        "`while (right > 0)` döngüsü kullanıcının şifre hakkını takip ederken; `do-while (select != 4)` menünün kullanıcıya en az bir defa gösterilmesini ve kullanıcı çıkış (4) diyene kadar ekranda kalmasını garanti eder.",
    },
  ],
};
