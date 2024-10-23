using backend.Helpers;
using backend.Interfaces;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Schema;

namespace backend.Bots
{
    public class MyBot : ActivityHandler
    {
        private readonly ILogger<MyBot> _logger;
        private readonly IProductRepository _productRepo;
        private readonly IProductTypeRepository _productTypeRepo;
        private bool _isSelectingProductType;
        public MyBot(ILogger<MyBot> logger, IProductRepository productRepo, IProductTypeRepository productTypeRepo)
        {
            _productRepo = productRepo;
            _productTypeRepo = productTypeRepo;
            _logger = logger;
            _isSelectingProductType = false;
        }

        protected override async Task OnMessageActivityAsync(ITurnContext<IMessageActivity> turnContext, CancellationToken cancellationToken)
        {
            var messageText = turnContext.Activity.Text.ToLowerInvariant();
            if (messageText.Contains("xin chào") || messageText.Contains("hi") || messageText.Contains("hello") || messageText.Contains("chào"))
            {
                await SendWelcomeMessageAsync(turnContext, cancellationToken);
            }
            else if (messageText.Contains("lĩnh vực") || messageText.Contains("loại sản phẩm"))
            {
                await SendProductTypeInfoAsync(turnContext, cancellationToken);
            }
            else if (int.TryParse(messageText, out int productTypeId))
            {
                await SendSpecificProductTypeInfoAsync(turnContext, productTypeId, cancellationToken);
            }
            else if (messageText.Contains("giúp") || messageText.Contains("help"))
            {
                await SendHelpMessageAsync(turnContext, cancellationToken);
            }
            else if (messageText.Contains("sản phẩm") || messageText.Contains("mua hàng"))
            {
                await SendProductInfoAsync(turnContext, cancellationToken);
            }
            else if (messageText.Contains("liên hệ") || messageText.Contains("contact"))
            {
                await SendContactInfoAsync(turnContext, cancellationToken);
            }
            else if (messageText.Contains("giá") || messageText.Contains("price"))
            {
                await SendPriceInfoAsync(turnContext, cancellationToken);
            }
            else
            {
                // Default response for unrecognized questions
                await turnContext.SendActivityAsync(
                    MessageFactory.Text("Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi về:\n" +
                    "- Thông tin sản phẩm\n" +
                    "- Giá cả\n" +
                    "- Thông tin liên hệ\n" +
                    "Hoặc gõ 'help' để được trợ giúp."),
                    cancellationToken);
            }
        }
        private async Task SendProductTypeInfoAsync(ITurnContext turnContext, CancellationToken cancellationToken)
        {
            var productType = await _productTypeRepo.GetAllProductType();
            if (productType == null || !productType.Any())
            {
                var noProductsResponse = "Hiện tại không có lĩnh vực nào.";
                await turnContext.SendActivityAsync(MessageFactory.Text(noProductsResponse), cancellationToken);
                return;
            }
            var response = "Danh sách lĩnh vực hiện có:\n";
            foreach (var producttype in productType)
            {

                response += $"{producttype.Id}. {producttype.ProductType_Name}\n";
            }
            response += "\nNếu bạn muốn xem sản phẩm thuộc lĩnh vực vui lòng chọn số thứ tự của lĩnh vực!";
            await turnContext.SendActivityAsync(MessageFactory.Text(response), cancellationToken);

        }
        private async Task SendSpecificProductTypeInfoAsync(ITurnContext turnContext, int productTypeId, CancellationToken cancellationToken)
        {
            var productType = await _productTypeRepo.GetByIdAsync(productTypeId); // Thêm phương thức này trong repo của bạn

            if (productType == null)
            {
                await turnContext.SendActivityAsync(MessageFactory.Text("Không tìm thấy lĩnh vực này."), cancellationToken);
                return;
            }
            if (productType.Products == null || !productType.Products.Any())
            {

                await turnContext.SendActivityAsync(MessageFactory.Text("Chưa có sản phẩm thuộc lĩnh vực này!"), cancellationToken);
                return;
            }
            var response = "Danh sách sản phẩm của lĩnh vực hiện có:\n";
            foreach (var product in productType.Products)
            {
                response += $"\n- Tên: {product.Product_Name} - Giá: {product.Price}\n";
            }
            await turnContext.SendActivityAsync(MessageFactory.Text(response), cancellationToken);
        }
        private async Task SendWelcomeMessageAsync(ITurnContext turnContext, CancellationToken cancellationToken)
        {
            var response = "Xin chào! Tôi là bot hỗ trợ. Tôi có thể giúp bạn:\n" +
                          "1. Tìm hiểu về sản phẩm\n" +
                          "2. Kiểm tra giá\n" +
                          "3. Thông tin liên hệ\n" +
                          "Bạn cần hỗ trợ gì ạ?";
            await turnContext.SendActivityAsync(MessageFactory.Text(response), cancellationToken);
        }

        private async Task SendHelpMessageAsync(ITurnContext turnContext, CancellationToken cancellationToken)
        {
            var response = "Bạn có thể hỏi tôi bằng cách gõ:\n" +
                          "- 'sản phẩm' để xem thông tin sản phẩm\n" +
                          "- 'giá' để xem bảng giá\n" +
                          "- 'liên hệ' để biết thông tin liên hệ\n" +
                          "- 'hello' hoặc 'xin chào' để chào hỏi";
            await turnContext.SendActivityAsync(MessageFactory.Text(response), cancellationToken);
        }

        private async Task SendProductInfoAsync(ITurnContext turnContext, CancellationToken cancellationToken)
        {
            var products = await _productRepo.GetAllProducts();

            if (products == null || !products.Any())
            {
                var noProductsResponse = "Hiện tại không có sản phẩm nào.";
                await turnContext.SendActivityAsync(MessageFactory.Text(noProductsResponse), cancellationToken);
                return;
            }

            // Tạo chuỗi phản hồi cho người dùng dựa trên danh sách sản phẩm
            var response = "Danh sách sản phẩm hiện có:\n";
            foreach (var product in products)
            {
                response += $"- {product.Product_Name} (Giá: {product.Price}đ)\n";
            }

            // Gửi phản hồi cho người dùng
            await turnContext.SendActivityAsync(MessageFactory.Text(response), cancellationToken);
        }

        private async Task SendPriceInfoAsync(ITurnContext turnContext, CancellationToken cancellationToken)
        {
            var response = "Bảng giá sản phẩm:\n" +
                          "- Sản phẩm A: 100.000đ\n" +
                          "- Sản phẩm B: 200.000đ\n" +
                          "- Sản phẩm C: 300.000đ\n" +
                          "Giá có thể thay đổi. Vui lòng liên hệ để biết thêm chi tiết.";
            await turnContext.SendActivityAsync(MessageFactory.Text(response), cancellationToken);
        }

        private async Task SendContactInfoAsync(ITurnContext turnContext, CancellationToken cancellationToken)
        {
            var response = "Thông tin liên hệ:\n" +
                          "- Email: contact@example.com\n" +
                          "- Điện thoại: 1900 xxxx\n" +
                          "- Địa chỉ: 123 ABC Street\n" +
                          "Thời gian làm việc: 8:00 - 17:00 (Thứ 2 - Thứ 6)";
            await turnContext.SendActivityAsync(MessageFactory.Text(response), cancellationToken);
        }

        protected override async Task OnMembersAddedAsync(IList<ChannelAccount> membersAdded, ITurnContext<IConversationUpdateActivity> turnContext, CancellationToken cancellationToken)
        {
            foreach (var member in membersAdded)
            {
                if (member.Id != turnContext.Activity.Recipient.Id)
                {
                    await SendWelcomeMessageAsync(turnContext, cancellationToken);
                }
            }
        }
    }
}